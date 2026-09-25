import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';

import { Loader } from '../../../../shared/components/loader/loader';
import { Surface } from '../../../../shared/components/surface/surface';
import { PaymentService } from '../../services/facade/payment.service';
import { ProductModel } from '../../../../shared/types/product-model';
import { UiButton } from '../../../../shared/ui/button/button';
import { OnboardingCart } from '../../../(users)/client/components/onboarding-cart/onboarding-cart';
import { OnboardingStateService } from '../../onboarding-state.service';
import { OnboardingTitle } from '../../../(users)/client/components/onboarding-title/onboarding-title';
import { OnboardingStep } from '../../../(users)/client/components/onboarding-step/onboarding-step';

import {
  ShippingCalculationResponse,
  ShippingOption,
  ShippingItem,
  CouponValidateResponse,
  ShippingOrder,
} from '../../../../shared/types/shipping';

interface ProductsData {
  products: ProductModel[];
  digital: ProductModel[];
  additional: ProductModel[];
}

const MAX_LOGO_SIZE_BYTES = 5 * 1024 * 1024;

const ACCEPTED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];

// Fallback usado quando o navegador/SO não informa (ou informa errado) o
// `file.type` do arquivo — isso acontece com frequência para SVG e, em
// alguns Windows/Android mal configurados, também para PNG/JPG.
const ACCEPTED_LOGO_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];

const CEP_DEBOUNCE_MS = 500;

const DEFAULT_COUPON_ERROR_MESSAGE = 'Cupom inválido ou expirado.';

@Component({
  selector: 'app-products',
  imports: [OnboardingTitle, OnboardingStep, Loader, Surface, UiButton, OnboardingCart],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private paymentService = inject(PaymentService);
  private onboardingState = inject(OnboardingStateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // =========================================================
  // PASSO ATUAL DO ONBOARDING
  // =========================================================

  private routeData = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data,
  });

  readonly currentStep = computed(() => this.routeData()['step'] as number);

  // =========================================================
  // PRODUTO / PLANO
  // =========================================================

  private queryParams = toSignal(this.route.queryParams, {
    initialValue: {} as Record<string, string>,
  });

  private planFromUrl = computed(() => this.queryParams()['plan'] ?? null);

  readonly selectedProduct = computed<string | null>(() => {
    return this.planFromUrl() ?? this.onboardingState.getPlan();
  });

  constructor() {
    // =======================================================
    // SINCRONIZA PLANO DA URL COM O ESTADO
    // =======================================================

    effect(() => {
      const plan = this.planFromUrl();

      if (plan) {
        this.onboardingState.setPlan(plan);
      }
    });

    // =======================================================
    // PREVIEW DAS LOGOS
    // =======================================================

    effect((onCleanup) => {
      const files = this.logoFiles();

      const urls: Record<string, string> = {};

      for (const [id, file] of Object.entries(files)) {
        if (file) {
          urls[id] = URL.createObjectURL(file);
        }
      }

      this.logoPreviewUrls.set(urls);

      onCleanup(() => {
        Object.values(urls).forEach((url) => {
          URL.revokeObjectURL(url);
        });
      });
    });

    // =======================================================
    // CÁLCULO AUTOMÁTICO DO FRETE
    // =======================================================

    effect((onCleanup) => {
      const cep = this.cepDigits();
      const hasPhysical = this.hasPhysicalProductSelected();

      // IMPORTANTE: lemos o carrinho "cru" aqui (e não só o computed
      // booleano acima) de propósito. Um computed() só notifica quem o
      // observa quando o VALOR dele muda — se a cliente marcar/desmarcar a
      // personalização com logo enquanto um cartão continua selecionado,
      // `hasPhysicalProductSelected()` continua `true` antes e depois, e
      // esse effect nunca seria re-executado. Só que `resetShipping()`
      // (chamado dentro de `selectItem()`) já zerou o frete — e sem o
      // effect reagir, o frete some e nunca mais volta sozinho. Lendo
      // `selectedItems()` diretamente garantimos que QUALQUER alteração no
      // carrinho reagenda o recálculo, enquanto o CEP já estiver completo.
      const items = this.selectedItems();

      if (cep.length !== 8 || !hasPhysical || items.length === 0) {
        return;
      }

      const timeoutId = setTimeout(() => this.calculateShipping(), CEP_DEBOUNCE_MS);

      onCleanup(() => {
        clearTimeout(timeoutId);
      });
    });
  }

  // =========================================================
  // BUSCA DE PRODUTOS
  // =========================================================

  private productsResource = rxResource<ProductsData, string | null>({
    params: () => this.selectedProduct(),

    stream: ({ params }) =>
      this.paymentService.fetchProducts().pipe(
        map((data) => ({
          products: data.fisico.filter((p: ProductModel) => p.plan_type === params),

          digital: data.digital.filter((p: ProductModel) => p.plan_type === params),

          additional: data.adicional,
        })),
      ),
  });

  readonly isInitialLoading = computed(() => this.productsResource.isLoading());

  readonly products = computed(() => this.productsResource.value()?.products ?? []);

  readonly digitalProducts = computed(() => this.productsResource.value()?.digital ?? []);

  readonly aditionalProducts = computed(() => this.productsResource.value()?.additional ?? []);

  readonly resourceError = computed(() => this.productsResource.error());

  reloadProducts() {
    this.productsResource.reload();
  }

  // =========================================================
  // MODO DE SELEÇÃO
  // =========================================================

  readonly selectionMode = signal<'fisico' | 'digital' | null>(null);

  selectMode(mode: 'fisico' | 'digital') {
    this.selectionMode.set(mode);

    if (mode === 'digital') {
      const digital = this.digitalProducts()[0];

      this.selectedItems.set(
        digital
          ? [
              {
                id: digital.id.toString(),
                price: digital.price_cents,
              },
            ]
          : [],
      );

      this.logoFiles.set({});
      this.logoErrors.set({});

      this.resetShipping();
      this.resetCoupon();
    } else {
      this.selectedItems.set([]);

      this.resetShipping();
      this.resetCoupon();
    }
  }

  // =========================================================
  // CARTÃO SELECIONADO
  // =========================================================

  readonly hasCardSelected = computed(
    () =>
      this.selectionMode() === 'fisico' &&
      this.products().some(
        (product) => product.type === 'card' && this.isSelected(product.id.toString()),
      ),
  );

  // =========================================================
  // PERSONALIZAÇÃO COM LOGO
  // =========================================================

  readonly showAdditionalProducts = computed(
    () => this.selectedProduct() === 'pro' && this.hasCardSelected(),
  );

  readonly selectedLogoAdditional = computed(
    () =>
      this.aditionalProducts().find(
        (additional) => additional.type === 'logo' && this.isSelected(additional.id.toString()),
      ) ?? null,
  );

  // =========================================================
  // CARRINHO
  // =========================================================

  readonly selectedItems = signal<{ id: string; price: number }[]>([]);

  readonly subtotal = computed(() =>
    this.selectedItems().reduce((sum, item) => sum + item.price, 0),
  );

  readonly cartItems = computed(() => {
    const shippingResponse = this.shippingCalculationResponse();

    const coupon = this.couponResponse();
    const shipping = this.selectedShipping();
    const subtotal = this.subtotal();

    const discount = shippingResponse?.discount_cents ?? coupon?.discount_cents ?? 0;

    const total = Math.max(0, subtotal - discount + (shipping?.price_cents ?? 0));

    return [
      {
        label: 'Perfil',
        value: this.selectedProduct() ?? 'Falha ao carregar',
      },

      {
        label: 'Produtos Selecionados',
        value:
          this.selectedItems().length > 0
            ? `${this.selectedItems().length} produto(s)`
            : 'Nenhum selecionado',
      },

      {
        label: 'Subtotal',
        value: this.formatPrice(subtotal),
      },

      ...(discount > 0
        ? [
            {
              label: 'Desconto',
              value: `- ${this.formatPrice(discount)}`,
            },
          ]
        : []),

      ...(this.hasPhysicalProductSelected()
        ? [
            {
              label: 'Frete',
              value: shipping ? this.formatPrice(shipping.price_cents) : 'Não calculado',
            },
          ]
        : []),

      {
        label: 'Total',
        value: this.formatPrice(total),
      },
    ];
  });

  // =========================================================
  // CUPOM
  // =========================================================

  readonly couponCode = signal<string>('');

  readonly couponStatus = signal<'idle' | 'valid' | 'invalid' | 'loading'>('idle');

  readonly couponResponse = signal<CouponValidateResponse | null>(null);

  // Mensagem específica devolvida pelo backend (ex: "Cupom aplicável
  // apenas a cartões.", "Cupom inativo ou expirado.", "Cupom não
  // aplicável para o onboarding."). Cada tipo de cupom tem um motivo de
  // falha diferente, então não faz sentido mostrar sempre o mesmo texto
  // genérico.
  readonly couponErrorMessage = signal<string | null>(null);

  private couponRequestId = 0;

  applyCoupon() {
    const code = this.couponCode().trim();

    if (!code) {
      return;
    }

    this.couponStatus.set('loading');
    this.couponErrorMessage.set(null);

    const items: ShippingItem[] = this.selectedItems().map((item) => ({
      product: parseInt(item.id, 10),
      quantity: 1,
    }));

    const requestId = ++this.couponRequestId;

    this.paymentService.validateCoupon(code, items).subscribe({
      next: (response: CouponValidateResponse) => {
        // Ignora respostas "atrasadas" de uma chamada antiga caso a cliente
        // já tenha editado o cupom ou o carrinho de novo nesse meio-tempo.
        if (requestId !== this.couponRequestId) {
          return;
        }

        this.couponResponse.set(response);
        this.couponStatus.set('valid');
        this.couponErrorMessage.set(null);

        toast.success('Cupom aplicado com sucesso!');
      },

      error: (error: HttpErrorResponse) => {
        if (requestId !== this.couponRequestId) {
          return;
        }

        this.couponResponse.set(null);
        this.couponStatus.set('invalid');

        const message = this.extractCouponErrorMessage(error);

        this.couponErrorMessage.set(message);

        toast.error(message);
      },
    });
  }

  // Extrai a mensagem específica que o backend devolveu para o cupom.
  // O backend segue o padrão do Django REST Framework: erro de campo vem
  // como uma lista de strings, ex:
  //   { "coupon_code": ["Cupom aplicável apenas a cartões."] }
  // Isso cobre todos os casos documentados: código ausente, cupom
  // inválido, inativo/expirado, não aplicável ao onboarding, e os casos
  // específicos de cartão/tag.
  private extractCouponErrorMessage(error: HttpErrorResponse): string {
    const body = error?.error;

    const fieldErrors = body?.coupon_code;

    if (Array.isArray(fieldErrors) && typeof fieldErrors[0] === 'string' && fieldErrors[0].trim()) {
      return fieldErrors[0];
    }

    // Alguns erros (500, timeout, CORS, resposta fora do padrão) não vêm
    // nesse formato. Nesses casos caímos numa mensagem genérica em vez de
    // mostrar "undefined" ou "[object Object]" pra cliente.
    if (typeof body?.detail === 'string' && body.detail.trim()) {
      return body.detail;
    }

    return DEFAULT_COUPON_ERROR_MESSAGE;
  }

  private resetCoupon() {
    this.couponRequestId++;

    this.couponCode.set('');
    this.couponStatus.set('idle');
    this.couponResponse.set(null);
    this.couponErrorMessage.set(null);
  }

  // =========================================================
  // LOGOS
  // =========================================================

  readonly logoFiles = signal<Record<string, File | null>>({});

  readonly logoPreviewUrls = signal<Record<string, string>>({});

  readonly logoErrors = signal<Record<string, string | null>>({});

  logoPreviewFor(id: string): string | null {
    return this.logoPreviewUrls()[id] ?? null;
  }

  logoErrorFor(id: string): string | null {
    return this.logoErrors()[id] ?? null;
  }

  isLogoMissing(id: string): boolean {
    return this.isSelected(id) && !this.logoFiles()[id];
  }

  private isAcceptedLogoFile(file: File): boolean {
    if (ACCEPTED_LOGO_TYPES.includes(file.type)) {
      return true;
    }

    // Alguns navegadores/SO não preenchem (ou preenchem errado) o
    // `file.type` — principalmente para SVG. Nesse caso, confiamos na
    // extensão do arquivo em vez de recusar um arquivo válido.
    const name = file.name.toLowerCase();

    return ACCEPTED_LOGO_EXTENSIONS.some((extension) => name.endsWith(extension));
  }

  onLogoSelected(id: string, event: Event) {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (!this.isAcceptedLogoFile(file)) {
      this.logoErrors.update((errors) => ({
        ...errors,
        [id]: 'Formato inválido. Use PNG, JPG, SVG ou WEBP.',
      }));

      input.value = '';

      return;
    }

    if (file.size === 0) {
      this.logoErrors.update((errors) => ({
        ...errors,
        [id]: 'Arquivo vazio ou corrompido. Tente novamente.',
      }));

      input.value = '';

      return;
    }

    if (file.size > MAX_LOGO_SIZE_BYTES) {
      this.logoErrors.update((errors) => ({
        ...errors,
        [id]: 'Arquivo muito grande. Máximo de 5MB.',
      }));

      input.value = '';

      return;
    }

    this.logoErrors.update((errors) => ({
      ...errors,
      [id]: null,
    }));

    this.logoFiles.update((files) => ({
      ...files,
      [id]: file,
    }));

    // Limpa o input mesmo em caso de sucesso: assim, se a cliente remover e
    // selecionar o MESMO arquivo de novo depois, o "change" dispara de novo
    // normalmente (o navegador não dispara change se o value não mudou).
    input.value = '';
  }

  removeLogo(id: string) {
    this.logoFiles.update((files) => ({
      ...files,
      [id]: null,
    }));

    this.logoErrors.update((errors) => ({
      ...errors,
      [id]: null,
    }));
  }

  // =========================================================
  // FILE -> BASE64
  // =========================================================

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsDataURL(file);
    });
  }

  private async getLogoImageBase64(): Promise<string | undefined> {
    const additional = this.selectedLogoAdditional();

    if (!additional) {
      return undefined;
    }

    const file = this.logoFiles()[additional.id.toString()];

    if (!file) {
      return undefined;
    }

    return this.fileToBase64(file);
  }

  // =========================================================
  // SELEÇÃO DE PRODUTOS
  // =========================================================

  isSelected(id: string): boolean {
    return this.selectedItems().some((item) => item.id === id);
  }

  selectItem(item: { id: string; price: number; type?: string }) {
    const existingIndex = this.selectedItems().findIndex(
      (selectedItem) => selectedItem.id === item.id,
    );

    if (existingIndex > -1) {
      this.selectedItems.update((items) => items.filter((_, index) => index !== existingIndex));

      this.removeLogo(item.id);

      // Se o item desmarcado era um cartão e não sobrou nenhum cartão
      // selecionado, a personalização com logo deixa de fazer sentido (a UI
      // dela some). Sem isso, um adicional de logo ficava "fantasma": ainda
      // selecionado no carrinho, com arquivo enviado, mas sem nenhum cartão
      // vinculado — bagunçando o frete e a validação do botão Continuar.
      if (item.type === 'card' && !this.hasCardSelected()) {
        for (const additional of this.aditionalProducts()) {
          const additionalId = additional.id.toString();

          if (this.isSelected(additionalId)) {
            this.selectedItems.update((items) => items.filter((i) => i.id !== additionalId));

            this.removeLogo(additionalId);
          }
        }
      }
    } else {
      this.selectedItems.update((items) => [...items, item]);
    }

    this.resetShipping();
    this.resetCoupon();
  }

  // =========================================================
  // PREÇO
  // =========================================================

  formatPrice(priceCents: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceCents / 100);
  }

  // =========================================================
  // FRETE
  // =========================================================

  readonly cepDigits = signal('');

  readonly shippingCalculationResponse = signal<ShippingCalculationResponse | null>(null);

  readonly isCalculatingShipping = signal(false);

  readonly selectedShipping = signal<ShippingOption | null>(null);

  private shippingRequestId = 0;

  readonly shippingOptions = computed(
    () => this.shippingCalculationResponse()?.shipping_options ?? [],
  );

  selectShipping(option: ShippingOption) {
    this.selectedShipping.set(option);
  }

  private resetShipping() {
    // Invalida qualquer chamada de frete que ainda esteja "em voo": a
    // resposta dela será ignorada quando chegar (ver calculateShipping()).
    this.shippingRequestId++;

    this.shippingCalculationResponse.set(null);
    this.selectedShipping.set(null);
    this.isCalculatingShipping.set(false);
  }

  readonly hasPhysicalProductSelected = computed(
    () => this.selectionMode() === 'fisico' && this.physicalSelectedItems().length > 0,
  );

  private physicalSelectedItems = computed(() =>
    this.selectedItems().filter((item) =>
      this.products().some((product) => product.id.toString() === item.id),
    ),
  );

  readonly cepDisplay = computed(() => this.formatCep(this.cepDigits()));

  private formatCep(digits: string): string {
    if (digits.length <= 5) {
      return digits;
    }

    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }

  onCepInput(event: Event) {
    const input = event.target as HTMLInputElement;

    const digits = input.value.replace(/\D/g, '').slice(0, 8);

    this.cepDigits.set(digits);

    input.value = this.formatCep(digits);

    this.resetShipping();
  }

  calculateShipping() {
    if (!this.hasPhysicalProductSelected() || this.cepDigits().length !== 8) {
      return;
    }

    const shippingItems = this.physicalSelectedItems().map((item) => ({
      product: parseInt(item.id, 10),
      quantity: 1,
    }));

    const shippingData = {
      postal_code: this.cepDigits(),

      items: shippingItems,
    };

    const requestId = ++this.shippingRequestId;

    this.isCalculatingShipping.set(true);

    const loadingToast = toast.loading('Aguarde, buscando informações...', {
      description: '',
    });

    this.paymentService.searchShipping(shippingData).subscribe({
      next: (response: ShippingCalculationResponse) => {
        // Uma chamada mais recente pode ter sido disparada (CEP ou
        // carrinho mudaram de novo) enquanto esta ainda estava em
        // andamento. Se não formos mais a chamada "atual", ignoramos a
        // resposta para não sobrescrever dados novos com dados velhos.
        if (requestId !== this.shippingRequestId) {
          return;
        }

        toast.success('Informações encontradas', {
          description: '',
          id: loadingToast,
        });

        this.shippingCalculationResponse.set(response);

        this.selectedShipping.set(null);

        this.isCalculatingShipping.set(false);
      },

      error: (error) => {
        if (requestId !== this.shippingRequestId) {
          return;
        }

        toast.error('Erro ao buscar informações', {
          description: '',
          id: loadingToast,
        });

        console.error('Erro ao buscar informações:', error);

        this.isCalculatingShipping.set(false);
      },
    });
  }

  // =========================================================
  // PODE CONTINUAR?
  // =========================================================

  readonly canContinue = computed(() => {
    if (this.selectionMode() === 'digital') {
      return this.selectedItems().length > 0;
    }

    if (this.selectionMode() === 'fisico') {
      const baseValid = this.selectedItems().length > 0 && this.selectedShipping() !== null;

      if (!baseValid) {
        return false;
      }

      const logoAdditional = this.selectedLogoAdditional();

      if (logoAdditional && this.isLogoMissing(logoAdditional.id.toString())) {
        return false;
      }

      return true;
    }

    return false;
  });

  // =========================================================
  // ENVIO FINAL
  // =========================================================

  readonly isSubmitting = signal(false);

  async continueToNextStep() {
    if (!this.canContinue() || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);

    const loadingToast = toast.loading('Preparando seu carrinho...', {
      description: '',
    });

    let logoImage: string | undefined;

    try {
      logoImage = await this.getLogoImageBase64();
    } catch (error) {
      toast.error('Erro ao processar a imagem da logo.', {
        description: '',
        id: loadingToast,
      });

      console.error('Erro ao converter logo para base64:', error);

      this.isSubmitting.set(false);

      return;
    }

    const items: ShippingItem[] = this.selectedItems().map((item) => ({
      product: parseInt(item.id, 10),
      quantity: 1,
    }));

    const payload: ShippingOrder = {
      items,

      postal_code: this.selectionMode() === 'fisico' ? this.cepDigits() : '',

      shipping_service_code:
        this.selectionMode() === 'fisico' ? (this.selectedShipping()?.service_code ?? '') : '',

      ...(this.couponStatus() === 'valid' && this.couponCode().trim()
        ? {
            coupon_code: this.couponCode().trim(),
          }
        : {}),

      ...(logoImage
        ? {
            logo_image: logoImage,
          }
        : {}),
    };

    this.paymentService.createTemporaryCart(payload).subscribe({
      next: (response) => {
        toast.success('Carrinho criado com sucesso!', {
          description: '',
          id: loadingToast,
        });

        this.isSubmitting.set(false);

        const temporaryCart = {
          id: response.id,
          expiresAt: response.expires_at,

          subtotal: this.subtotal(),

          discount:
            this.shippingCalculationResponse()?.discount_cents ??
            this.couponResponse()?.discount_cents ??
            0,

          shipping: this.selectedShipping()?.price_cents ?? 0,

          total:
            this.subtotal() -
            (this.shippingCalculationResponse()?.discount_cents ??
              this.couponResponse()?.discount_cents ??
              0) +
            (this.selectedShipping()?.price_cents ?? 0),

          shippingService: this.selectedShipping()?.service_name ?? '',
        };

        localStorage.setItem('temporaryCart', JSON.stringify(temporaryCart));

        console.log(response);

        this.router.navigate(['/onboarding/terms']);
      },

      error: (error) => {
        toast.error('Erro ao criar carrinho. Tente novamente.', {
          description: '',
          id: loadingToast,
        });

        console.error('Erro ao criar carrinho temporário:', error);

        this.isSubmitting.set(false);
      },
    });
  }

  // =========================================================
  // VOLTAR
  // =========================================================

  goBack() {
    window.history.back();
  }
}
