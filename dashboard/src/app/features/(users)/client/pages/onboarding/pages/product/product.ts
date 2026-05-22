import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/facade/payment.service';
import { OnboardingStep } from '../../../../components/onboarding-step/onboarding-step';
import { OnboardingTitle } from '../../../../components/onboarding-title/onboarding-title';
import { Surface } from '../../../../../../../shared/components/surface/surface';
import { UiButton } from '../../../../../../../shared/ui/button/button';
import { OnboardingCart } from '../../../../components/onboarding-cart/onboarding-cart';
import { ProductModel } from '../../../../../../../shared/types/product-model';
import { Loader } from '../../../../../../../shared/components/loader/loader';
import { Auth } from '../../../../../../auth/services/facade/auth';
import { User } from '../../../../../../../shared/types/user.model';
import {
  CouponValidateResponse,
  ShippingCalculationResponse,
  ShippingItem,
  ShippingOption,
} from '../../../../../../../shared/types/shipping';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-product',
  imports: [OnboardingStep, OnboardingTitle, Surface, UiButton, OnboardingCart, Loader],
  templateUrl: './product.html',
  styleUrls: ['./product.css'],
})
export class Product implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private paymentService = inject(PaymentService);
  private authservice = inject(Auth);

  readonly products = signal<ProductModel[]>([]);
  readonly aditionalProducts = signal<any[]>([]);
  readonly digitalProducts = signal<any[]>([]);
  readonly selectedProduct = signal<null | string>(null);

  readonly isInitialLoading = signal<boolean>(true);

  readonly selectedItems = signal<{ id: string; price: number }[]>([]);
  readonly subtotal = computed(() => {
    return this.selectedItems().reduce((sum, item) => sum + item.price, 0);
  });

  readonly ShippingCalculationResponse = signal<ShippingCalculationResponse | null>(null);

  readonly currentStep = computed(() => {
    return this.route.snapshot.data['step'] as number;
  });

  readonly authUser = signal<null | User>(null);

  isSelected(id: string): boolean {
    return this.selectedItems().some((i) => i.id === id);
  }

  // Variaveis

  ngOnInit() {
    this.loadProducts();

    this.route.queryParams.subscribe((params) => {
      this.selectedProduct.set(params['plan']);
    });

    this.loadProfile();
  }

  loadProducts() {
    this.paymentService.fetchProducts().subscribe({
      next: (data) => {
        console.log(data);
        const filteredProducts = data.fisico.filter(
          (product) => product.plan_type === this.selectedProduct(),
        );

        const filteredDigitalProducts = data.digital.filter(
          (product) => product.plan_type === this.selectedProduct(),
        );

        console.log(filteredProducts);

        this.products.set(filteredProducts);
        this.aditionalProducts.set(data.adicional);
        this.digitalProducts.set(filteredDigitalProducts);
        console.log('Produtos filtrados:', this.products());
      },
      error: (error) => {
        console.error('Erro ao carregar os produtos:', error);
      },
      complete: () => {
        this.isInitialLoading.set(false);
      },
    });
  }

  loadProfile() {
    this.authservice.loadUser().subscribe({
      next: (user) => {
        console.log('Perfil carregado:', user);
        this.authUser.set(user);
      },
    });
  }

  readonly shippingOptions = computed(
    () => this.ShippingCalculationResponse()?.shipping_options ?? [],
  );

  readonly selectedShipping = signal<ShippingOption | null>(null);

  selectShipping(option: ShippingOption) {
    this.selectedShipping.set(option);
  }

  readonly cartItems = computed(() => {
    const coupon = this.couponResponse();
    const shipping = this.selectedShipping();
    const subtotal = this.subtotal();
    const discount = coupon?.discount_cents ?? 0;
    const total = shipping ? subtotal - discount + shipping.price_cents : null;

    return [
      { label: 'Perfil', value: this.selectedProduct() ?? 'Falha ao carregar' },
      {
        label: 'Produtos Selecionados',
        value:
          this.selectedItems().length > 0
            ? `${this.selectedItems().length} produto(s)`
            : 'Nenhum selecionado',
      },
      { label: 'Subtotal', value: this.formatPrice(subtotal) },
      ...(coupon ? [{ label: 'Desconto', value: `- ${this.formatPrice(discount)}` }] : []),
      {
        label: 'Frete',
        value: shipping ? this.formatPrice(shipping.price_cents) : 'Nenhum selecionado',
      },
      {
        label: 'Total',
        value: total !== null ? this.formatPrice(Math.max(0, total)) : '-',
      },
    ];
  });

  readonly couponCode = signal<string>('');
  readonly couponStatus = signal<'idle' | 'valid' | 'invalid' | 'loading'>('idle');
  readonly couponResponse = signal<CouponValidateResponse | null>(null);

  applyCoupon() {
    const code = this.couponCode().trim();
    if (!code) return;

    this.couponStatus.set('loading');

    const items: ShippingItem[] = this.selectedItems().map((item) => ({
      product: parseInt(item.id),
      quantity: 1,
    }));

    this.paymentService.validateCoupon(code, items).subscribe({
      next: (response: CouponValidateResponse) => {
        this.couponResponse.set(response);
        this.couponStatus.set('valid');
        toast.success('Cupom aplicado com sucesso!');
      },
      error: () => {
        this.couponResponse.set(null);
        this.couponStatus.set('invalid');
        toast.error('Cupom inválido ou expirado.');
      },
    });
  }

  calculateShipping() {
    if (!this.isSelected) {
      return 'Selecione um produto para calcular o frete';
    }

    const shippingItems = this.selectedItems().map((item) => ({
      product: parseInt(item.id),
      quantity: 1,
    }));

    const shippingData = {
      postal_code: this.authUser()?.cep || '',
      items: shippingItems,
    };

    const loadingToast = toast.loading('Aguarde, buscando informações...', {
      description: '',
    });
    return this.paymentService.searchShipping(shippingData).subscribe({
      next: (response) => {
        toast.success('Informações encontradas', {
          description: '',
          id: loadingToast,
        });
        this.ShippingCalculationResponse.set(response);
      },
      error: (error) => {
        toast.error('Erro ao buscar informações', {
          description: '',
          id: loadingToast,
        });
        console.error('Erro ao buscar informações:', error);
      },
    });
  }

  formatPrice(priceCents: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
      priceCents / 100,
    );
  }

  selectItem(item: { id: string; price: number }) {
    // Verificar se o produto já foi selecionado
    const existingIndex = this.selectedItems().findIndex((i) => i.id === item.id);

    if (existingIndex > -1) {
      // Se já existe, remove (desseleciona)
      this.selectedItems.update((items) => items.filter((_, i) => i !== existingIndex));
    } else {
      // Se não existe, adiciona
      this.selectedItems.update((items) => [...items, item]);
    }
  }

  canContinue(): boolean {
    return this.selectedItems().length > 0 && this.selectedShipping() !== null;
  }

  canCalculateShipping(): boolean {
    return this.selectedItems().length > 0;
  }

  nextPage() {
    if (!this.canContinue()) return;

    const order = {
      postal_code: this.authUser()?.cep || '',
      shipping_service_code: this.selectedShipping()!.service_code,
      total_cents: this.subtotal() + this.selectedShipping()!.price_cents,
      items: this.selectedItems().map((item) => ({
        product: parseInt(item.id),
        quantity: 1,
      })),
      ...(this.couponStatus() === 'valid' && this.couponCode().trim()
        ? { coupon_code: this.couponCode().trim() }
        : {}),
    };

    sessionStorage.setItem('onboarding_order', JSON.stringify(order));
    this.router.navigate(['/onboarding/terms']);
  }

  previousPage() {
    this.location.back();
  }
}
