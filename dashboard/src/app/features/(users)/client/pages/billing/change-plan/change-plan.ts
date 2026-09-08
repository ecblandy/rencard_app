import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

import { Loader } from '../../../../../../shared/components/loader/loader';
import { OnboardingTitle } from '../../../components/onboarding-title/onboarding-title';
import { UiButton } from '../../../../../../shared/ui/button/button';
import { AuthState } from '../../../../../auth/services/state/auth/auth-state';
import { ClientService } from '../../../services/facade/client.service';

type PlanType = 'galera' | 'pro';

type PlanCycle = 'MONTHLY' | 'SEMIANNUALLY' | 'YEARLY';

type BillingAction = 'subscribe' | 'change' | 'renew';

type SubscriptionStatus =
  | 'ativa'
  | 'aguardando pagamento'
  | 'cancelada'
  | 'expirada'
  | 'falhou'
  | 'teste';

interface PlanPrice {
  id: number;
  cycle: PlanCycle;
  price: number;
  active: boolean;
}

interface Plan {
  id: number;
  name: string;
  type: PlanType;
  description: string;
  display_order: number;
  active: boolean;
  prices: PlanPrice[];
  features?: string[];
}

interface PlansResponse {
  results?: Plan[];
}

@Component({
  selector: 'app-change-plan',
  standalone: true,
  imports: [NgIcon, Loader, OnboardingTitle, UiButton],
  templateUrl: './change-plan.html',
  styleUrl: './change-plan.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePlan implements OnInit {
  private readonly authState = inject(AuthState);
  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);

  // ============================================================
  // STATE
  // ============================================================

  readonly isInitialLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly plans = signal<Plan[]>([]);

  /**
   * Guarda o ID do plano que está sendo selecionado.
   *
   * Antes era um boolean global:
   *
   * isNavigating = signal(false)
   *
   * Isso fazia os DOIS botões exibirem loading.
   */
  readonly navigatingPlanId = signal<number | null>(null);

  // ============================================================
  // USER / CURRENT PLAN
  // ============================================================

  readonly activePlan = computed(() => {
    return this.authState.user()?.active_plan ?? null;
  });

  readonly currentPlanType = computed<PlanType | null>(() => {
    return (this.activePlan()?.type as PlanType) ?? null;
  });

  readonly currentPlan = computed<Plan | null>(() => {
    const currentType = this.currentPlanType();

    if (!currentType) {
      return null;
    }

    return this.plans().find((plan) => plan.type === currentType) ?? null;
  });

  // ============================================================
  // BILLING ACTION
  // ============================================================

  readonly billingAction = computed<BillingAction>(() => {
    const activePlan = this.activePlan();

    if (!activePlan) {
      return 'subscribe';
    }

    const status = activePlan.status as SubscriptionStatus;

    if (status === 'expirada' || status === 'cancelada' || status === 'falhou') {
      return 'renew';
    }

    return 'change';
  });

  // ============================================================
  // AVAILABLE PLANS
  // ============================================================

  readonly availablePlans = computed(() => {
    return this.plans();
  });

  // ============================================================
  // PAGE TEXT
  // ============================================================

  readonly pageTitle = computed(() => {
    switch (this.billingAction()) {
      case 'renew':
        return 'Renovar assinatura';

      case 'change':
        return 'Alterar plano';

      default:
        return 'Escolha seu plano';
    }
  });

  readonly pageDescription = computed(() => {
    switch (this.billingAction()) {
      case 'renew':
        return 'Escolha um plano para renovar sua assinatura';

      case 'change':
        return 'Escolha o plano que melhor atende às suas necessidades';

      default:
        return 'Escolha o plano e o período ideal para você';
    }
  });

  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {
    this.fetchPlans();
  }

  // ============================================================
  // FETCH PLANS
  // ============================================================

  fetchPlans(): void {
    this.isInitialLoading.set(true);
    this.error.set(null);

    this.clientService.fetchPlans().subscribe({
      next: (response: PlansResponse | Plan[]) => {
        const plans = Array.isArray(response) ? response : (response?.results ?? []);

        const activePlans = plans
          .filter((plan) => plan.active)
          .sort((a, b) => a.display_order - b.display_order);

        this.plans.set(activePlans);
        this.isInitialLoading.set(false);
      },

      error: (err) => {
        console.error('[ChangePlan] Erro ao carregar planos:', err);

        this.error.set('Não foi possível carregar os planos.');

        this.isInitialLoading.set(false);
      },
    });
  }

  // ============================================================
  // CURRENT PLAN
  // ============================================================

  isCurrentPlan(plan: Plan): boolean {
    const activePlan = this.activePlan();

    if (!activePlan) {
      return false;
    }

    const status = activePlan.status as SubscriptionStatus;

    /**
     * Plano expirado, cancelado ou com falha
     * pode ser renovado.
     */
    if (this.billingAction() === 'renew') {
      return false;
    }

    /**
     * IMPORTANTE:
     *
     * Durante o período de teste, o usuário ainda
     * pode selecionar o mesmo plano novamente.
     *
     * Exemplo:
     * Pro + teste => botão Pro continua disponível.
     */
    if (status === 'teste') {
      return false;
    }

    return plan.type === this.currentPlanType();
  }

  // ============================================================
  // NAVIGATION / LOADING
  // ============================================================

  isNavigatingPlan(plan: Plan): boolean {
    return this.navigatingPlanId() === plan.id;
  }

  continueToCheckout(plan: Plan): void {
    /**
     * Segurança extra para não permitir seleção
     * de um plano que esteja marcado como atual.
     */
    if (this.isCurrentPlan(plan)) {
      return;
    }

    /**
     * Impede múltiplos cliques enquanto uma navegação
     * já está acontecendo.
     */
    if (this.navigatingPlanId() !== null) {
      return;
    }

    /**
     * SOMENTE o plano clicado entra em loading.
     */
    this.navigatingPlanId.set(plan.id);

    this.router
      .navigate(['/client/billing/checkout'], {
        queryParams: {
          plan: plan.id,
        },
      })
      .then((success) => {
        /**
         * Caso a navegação falhe, libera o botão
         * novamente.
         */
        if (!success) {
          this.navigatingPlanId.set(null);
        }
      })
      .catch((err) => {
        console.error('[ChangePlan] Erro ao navegar:', err);

        this.navigatingPlanId.set(null);
      });
  }

  // ============================================================
  // PLAN ICON
  // ============================================================

  getPlanIcon(plan: Plan): string {
    return plan.type === 'pro' ? 'lucideCrown' : 'lucideHandshake';
  }

  // ============================================================
  // PLAN LABEL
  // ============================================================

  getPlanLabel(plan: Plan): string {
    return plan.type === 'pro' ? 'Plano profissional' : 'Plano essencial';
  }

  // ============================================================
  // FEATURES
  // ============================================================

  getFeatureCount(plan: Plan): number {
    return plan.features?.length ?? 0;
  }

  getHighlightFeatures(plan: Plan): string[] {
    return (plan.features ?? []).slice(0, 5);
  }

  // ============================================================
  // RETRY
  // ============================================================

  retry(): void {
    this.fetchPlans();
  }
}
