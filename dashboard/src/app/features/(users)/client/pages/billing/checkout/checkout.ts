import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { NgIcon } from '@ng-icons/core';

import { toast } from 'ngx-sonner';

import { Subscription, timer } from 'rxjs';

import { switchMap, take } from 'rxjs/operators';

import { FormsModule } from '@angular/forms';

import { DashboardTitle } from '../../../../components/dashboard-title/dashboard-title';

import { Surface } from '../../../../../../shared/components/surface/surface';

import { UiButton } from '../../../../../../shared/ui/button/button';

import { ClientService } from '../../../services/facade/client.service';

interface PlanPrice {
  id: number;
  cycle: 'MONTHLY' | 'SEMIANNUALLY' | 'YEARLY';
  price_cents: number;
  discount_pct: number;
  active: boolean;
}

interface Plan {
  id: number;
  name: string;
  description: string;
  features: string[];
  type: string;
  display_order: number;
  prices: PlanPrice[];
  active: boolean;
}

interface PlansResponse {
  count: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: Plan[];
}

interface PendingSubscription {
  id: number;
  plan: number;
  plan_price: number;
  plan_name: string;
  status: string;
  payment_link: string | null;
  billing_type: string;
  credit_card_last4: string;
  credit_card_brand: string;
  coupon_code: string;
  discount_cents: number;
  current_period_start: string;
  current_period_end: string;
  canceled_at: string | null;
}

@Component({
  selector: 'app-checkout',
  imports: [DashboardTitle, Surface, UiButton, NgIcon, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit, OnDestroy {
  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  private readonly clientService = inject(ClientService);

  // ============================================================
  // ESTADO PRINCIPAL
  // ============================================================

  readonly selectedCycle = signal<'MONTHLY' | 'SEMIANNUALLY' | 'YEARLY'>('YEARLY');

  readonly isLoading = signal(false);

  readonly isLoadingPlan = signal(true);

  readonly plan = signal<Plan | null>(null);

  // ============================================================
  // PAGAMENTO
  // ============================================================

  readonly isWaitingPayment = signal(false);

  readonly isPaymentReady = signal(false);

  readonly paymentError = signal(false);

  readonly pendingSubscription = signal<PendingSubscription | null>(null);

  private paymentPollingSubscription?: Subscription;

  // ============================================================
  // CUPOM
  // ============================================================

  couponCode = '';

  readonly couponApplied = signal(false);

  // ============================================================
  // CICLO / PREÇOS
  // ============================================================

  readonly availablePrices = computed(() => {
    return this.plan()?.prices.filter((price) => price.active) ?? [];
  });

  readonly selectedPrice = computed(() => {
    return this.availablePrices().find((price) => price.cycle === this.selectedCycle()) ?? null;
  });

  readonly selectedPriceInReais = computed(() => {
    const price = this.selectedPrice();

    if (!price) {
      return 0;
    }

    return price.price_cents / 100;
  });

  readonly formattedPrice = computed(() => {
    return this.formatPrice(this.selectedPrice()?.price_cents ?? 0);
  });

  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const planIdParam = params.get('plan');

      const planId = Number(planIdParam);

      if (!planIdParam || !Number.isInteger(planId) || planId <= 0) {
        toast.error('Plano inválido', {
          description: 'Não foi possível identificar o plano selecionado.',
        });

        this.router.navigate(['/client/billing/change-plan']);

        return;
      }

      this.loadPlan(planId);
    });
  }

  // ============================================================
  // DESTROY
  // ============================================================

  ngOnDestroy(): void {
    this.paymentPollingSubscription?.unsubscribe();
  }

  // ============================================================
  // BUSCAR PLANO
  // ============================================================

  private loadPlan(planId: number): void {
    this.isLoadingPlan.set(true);

    this.clientService.fetchPlans().subscribe({
      next: (response) => {
        const plansResponse = response as PlansResponse;

        const selectedPlan = plansResponse.results.find(
          (plan) => plan.id === planId && plan.active,
        );

        if (!selectedPlan) {
          toast.error('Plano não encontrado', {
            description: 'O plano selecionado não está mais disponível.',
          });

          this.isLoadingPlan.set(false);

          this.router.navigate(['/client/billing/change-plan']);

          return;
        }

        this.plan.set(selectedPlan);

        this.setInitialCycle(selectedPlan);

        this.isLoadingPlan.set(false);
      },

      error: (error) => {
        console.error('Erro ao buscar planos:', error);

        this.isLoadingPlan.set(false);

        toast.error('Não foi possível carregar o plano', {
          description: 'Tente novamente em alguns instantes.',
        });
      },
    });
  }

  // ============================================================
  // CICLO INICIAL
  // ============================================================

  private setInitialCycle(plan: Plan): void {
    const monthlyPrice = plan.prices.find((price) => price.active && price.cycle === 'MONTHLY');

    if (monthlyPrice) {
      this.selectedCycle.set('MONTHLY');

      return;
    }

    const firstAvailablePrice = plan.prices.find((price) => price.active);

    if (firstAvailablePrice) {
      this.selectedCycle.set(firstAvailablePrice.cycle);
    }
  }

  // ============================================================
  // ÍCONE DO PLANO
  // ============================================================

  getPlanIcon(plan: Plan): string {
    return plan.type === 'pro' ? 'lucideCrown' : 'lucideHandshake';
  }
  // ============================================================
  // LABELS
  // ============================================================

  getCycleLabel(cycle: PlanPrice['cycle']): string {
    const labels: Record<PlanPrice['cycle'], string> = {
      MONTHLY: 'Mensal',

      SEMIANNUALLY: 'Semestral',

      YEARLY: 'Anual',
    };

    return labels[cycle];
  }

  getCycleDescription(cycle: PlanPrice['cycle']): string {
    const descriptions: Record<PlanPrice['cycle'], string> = {
      MONTHLY: 'Cobrança mensal',

      SEMIANNUALLY: 'Cobrança a cada 6 meses',

      YEARLY: 'Cobrança anual',
    };

    return descriptions[cycle];
  }

  getPricePeriod(price: PlanPrice): string {
    switch (price.cycle) {
      case 'MONTHLY':
        return '/mês';

      case 'SEMIANNUALLY':
        return '/6 meses';

      case 'YEARLY':
        return '/ano';
    }
  }

  formatPrice(priceCents: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceCents / 100);
  }

  // ============================================================
  // SELEÇÃO
  // ============================================================

  selectCycle(cycle: PlanPrice['cycle']): void {
    if (this.isWaitingPayment() || this.isPaymentReady()) {
      return;
    }

    const priceExists = this.availablePrices().some((price) => price.cycle === cycle);

    if (!priceExists) {
      return;
    }

    this.selectedCycle.set(cycle);

    /*
     * Ao trocar o período, o cupom aplicado
     * deixa de ser considerado automaticamente.
     *
     * O usuário pode reaplicá-lo se desejar.
     */

    this.couponApplied.set(false);
  }

  // ============================================================
  // CUPOM
  // ============================================================

  applyCoupon(): void {
    const code = this.couponCode.trim();

    if (!code) {
      toast.error('Digite um cupom', {
        description: 'Informe o código do cupom para continuar.',
      });

      return;
    }

    if (this.isLoading()) {
      return;
    }

    /*
     * Neste momento o cupom é apenas armazenado
     * no frontend.
     *
     * O código será enviado para a API quando
     * createSubscription() for chamado.
     */

    this.couponCode = code;

    this.couponApplied.set(true);

    toast.success('Cupom adicionado', {
      description: 'O cupom será enviado junto com sua assinatura.',
    });
  }

  removeCoupon(): void {
    this.couponCode = '';

    this.couponApplied.set(false);

    toast.success('Cupom removido', {
      description: 'O cupom não será enviado na assinatura.',
    });
  }

  // ============================================================
  // NAVEGAÇÃO
  // ============================================================

  goBack(): void {
    this.router.navigate(['/client/billing/change-plan']);
  }

  // ============================================================
  // CHECKOUT / ASSINATURA
  // ============================================================

  subscribe(): void {
    const price = this.selectedPrice();

    if (!price) {
      toast.error('Período indisponível', {
        description: 'Selecione um período válido para continuar.',
      });

      return;
    }

    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    this.paymentError.set(false);

    this.isPaymentReady.set(false);

    this.pendingSubscription.set(null);

    const checkoutData = {
      plan_price: price.id,

      coupon_code:
        this.couponApplied() && this.couponCode.trim() ? this.couponCode.trim() : undefined,
    };

    console.log('Criando assinatura:', checkoutData);

    this.clientService.createSubscription(checkoutData).subscribe({
      next: (response) => {
        console.log('3 - Assinatura criada com sucesso:', response);

        this.isLoading.set(false);

        this.isWaitingPayment.set(true);

        this.startPaymentPolling();
      },

      error: (error) => {
        console.error('Erro ao criar assinatura:', error);

        this.isLoading.set(false);

        toast.error('Não foi possível iniciar a assinatura', {
          description: 'Tente novamente em alguns instantes.',
        });
      },
    });
  }

  // ============================================================
  // POLLING DO PAGAMENTO
  // ============================================================

  private startPaymentPolling(): void {
    this.paymentPollingSubscription?.unsubscribe();

    /*
     * A API do Asaas pode levar alguns segundos
     * para disponibilizar o payment_link.
     *
     * Primeira verificação imediatamente.
     *
     * Depois:
     * 1 tentativa a cada 3 segundos.
     *
     * Máximo:
     * 20 tentativas.
     *
     * Aproximadamente:
     * 1 minuto.
     */

    this.paymentPollingSubscription = timer(0, 3000)
      .pipe(
        switchMap(() => this.clientService.checkPendingSubscription()),

        take(20),
      )
      .subscribe({
        next: (response) => {
          console.log('4 - Verificando assinatura pendente:', response);

          const pending = response as PendingSubscription;

          this.pendingSubscription.set(pending);

          /*
           * A assinatura existir não significa
           * que o pagamento esteja pronto.
           *
           * Precisamos do payment_link.
           */

          if (pending?.payment_link && pending.payment_link.trim().length > 0) {
            this.paymentPollingSubscription?.unsubscribe();

            this.isWaitingPayment.set(false);

            this.isPaymentReady.set(true);

            console.log('5 - Link de pagamento disponível:', pending.payment_link);

            return;
          }
        },

        error: (error) => {
          console.error('Erro ao verificar assinatura pendente:', error);

          this.paymentPollingSubscription?.unsubscribe();

          this.isWaitingPayment.set(false);

          this.paymentError.set(true);

          toast.error('Não foi possível preparar o pagamento', {
            description: 'Tente novamente em alguns instantes.',
          });
        },

        complete: () => {
          /*
           * Se terminou sem encontrar o link,
           * atingimos o limite de tentativas.
           */

          if (this.isWaitingPayment() && !this.isPaymentReady()) {
            this.isWaitingPayment.set(false);

            this.paymentError.set(true);

            toast.error('O pagamento está demorando para ficar disponível', {
              description: 'Sua assinatura foi criada. Você pode verificar novamente.',
            });
          }
        },
      });
  }

  // ============================================================
  // ABRIR PAGAMENTO
  // ============================================================

  openPayment(): void {
    const paymentLink = this.pendingSubscription()?.payment_link;

    if (!paymentLink) {
      toast.error('Pagamento ainda não disponível', {
        description: 'Aguarde alguns instantes enquanto preparamos seu pagamento.',
      });

      return;
    }

    /*
     * Abre o pagamento em uma nova aba/janela.
     */

    window.open(paymentLink, '_blank', 'noopener,noreferrer');

    /*
     * Mantém a aba atual no fluxo da aplicação.
     */

    this.router.navigate(['/client/billing/preview']);
  }

  // ============================================================
  // TENTAR NOVAMENTE
  // ============================================================

  retryPayment(): void {
    this.paymentError.set(false);

    this.isPaymentReady.set(false);

    this.pendingSubscription.set(null);

    this.isWaitingPayment.set(true);

    this.startPaymentPolling();
  }
}
