import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { Router } from '@angular/router';

import { toast } from 'ngx-sonner';

import { AuthState } from '../../../../../auth/services/state/auth/auth-state';
import { Loader } from '../../../../../../shared/components/loader/loader';
import { PaymentService } from '../../../../../(onboarding)/services/facade/payment.service';
import { ClientService } from '../../../services/facade/client.service';
import { DashboardTitle } from '../../../../components/dashboard-title/dashboard-title';

import { Faq } from './components/faq/faq';
import { CurrentPlan } from './components/current-plan/current-plan';
import { BillingInfo } from './components/billing-info/billing-info';
import { PendingPayment } from './components/pending-payment/pending-payment';

import {
  CurrentPlanData,
  FeaturesData,
  PendingPaymentData,
  PendingSubscription,
} from '../../../types/pending-subscription';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [Faq, CurrentPlan, BillingInfo, PendingPayment, Loader, DashboardTitle],
  templateUrl: './preview.html',
  styleUrl: './preview.css',
})
export class Preview implements OnInit, OnDestroy {
  private readonly authState = inject(AuthState);
  private readonly paymentService = inject(PaymentService);
  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);

  readonly user = this.authState.user;

  // =========================================================
  // PAGAMENTO PENDENTE
  // =========================================================

  readonly pendingSubscription = signal<PendingSubscription | null>(null);

  readonly isPendingSubscriptionLoading = signal(true);

  readonly pendingPaymentRemainingSeconds = signal(0);

  private pendingExpirationTimer: ReturnType<typeof setInterval> | null = null;

  // =========================================================
  // ESTADO
  // =========================================================

  readonly isPaymentPending = computed(() => {
    const pending = this.pendingSubscription();

    if (!pending) {
      return false;
    }

    return !this.isPendingPaymentExpired(pending);
  });

  readonly hasNoPlan = computed(() => {
    const currentUser = this.user();

    return (
      !currentUser?.active_plan && !currentUser?.active_access_grant && !this.isPaymentPending()
    );
  });

  readonly isFreeTrial = computed(() => {
    return this.user()?.active_plan?.status === 'teste';
  });

  readonly hasActivePlan = computed(() => {
    const plan = this.user()?.active_plan;

    return !!plan && plan.status !== 'teste';
  });

  readonly canRenewSubscription = computed(() => {
    const status = this.user()?.active_plan?.status;

    return this.hasActivePlan() && ['ativa', 'expirada'].includes(status ?? '');
  });

  readonly isSubscriptionActive = computed(() => {
    return !this.isFreeTrial() && this.user()?.active_plan?.status === 'ativa';
  });

  readonly isSubscriptionExpired = computed(() => {
    return !this.isFreeTrial() && this.user()?.active_plan?.status === 'expirada';
  });

  readonly isSubscriptionCancelled = computed(() => {
    return !this.isFreeTrial() && this.user()?.active_plan?.status === 'cancelada';
  });

  readonly isSubscriptionFailed = computed(() => {
    return !this.isFreeTrial() && this.user()?.active_plan?.status === 'falhou';
  });

  readonly isSubscriptionActionBlocked = computed(() => {
    return this.isPendingSubscriptionLoading() || this.isPaymentPending();
  });

  // =========================================================
  // PLANO
  // =========================================================

  readonly currentPlanName = computed(() => {
    const pending = this.pendingSubscription();

    if (pending && !this.isPendingPaymentExpired(pending)) {
      return pending.plan_name;
    }

    if (this.hasNoPlan()) {
      return 'Nenhum plano ativo';
    }

    return this.user()?.active_plan?.name || 'Sem plano ativo';
  });

  readonly currentPlanDescription = computed(() => {
    return this.user()?.active_plan?.description || '';
  });

  readonly currentPlanFeatures = computed(() => {
    return this.user()?.active_plan?.features || [];
  });

  readonly subscriptionEndDate = computed(() => {
    return this.user()?.active_plan?.end_at ?? null;
  });

  readonly daysRemaining = computed(() => {
    const endDate = this.subscriptionEndDate();

    if (!endDate) {
      return 0;
    }

    const end = new Date(endDate);

    if (Number.isNaN(end.getTime())) {
      return 0;
    }

    const difference = end.getTime() - Date.now();

    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    return Math.max(0, days);
  });

  readonly paymentMethod = computed(() => {
    const pending = this.pendingSubscription();

    if (pending && !this.isPendingPaymentExpired(pending) && pending.billing_type) {
      return this.getBillingTypeLabel(pending.billing_type);
    }

    return this.user()?.active_plan?.payment_method || '';
  });

  readonly planType = computed(() => {
    const pending = this.pendingSubscription();

    if (pending && !this.isPendingPaymentExpired(pending)) {
      return 'Aguardando pagamento';
    }

    if (this.hasNoPlan()) {
      return 'Nenhum';
    }

    return this.user()?.active_plan?.type || 'unknown';
  });

  // =========================================================
  // PAGAMENTO PENDENTE
  // =========================================================

  readonly pendingPaymentCreatedDate = computed(() => {
    return this.pendingSubscription()?.payment_link_created_at ?? null;
  });

  readonly pendingPaymentExpiresAt = computed(() => {
    const pending = this.pendingSubscription();

    return pending ? this.getPendingExpirationDate(pending) : null;
  });

  readonly pendingPaymentAmount = computed(() => {
    return this.pendingSubscription()?.plan_price ?? 0;
  });

  readonly pendingPaymentLink = computed(() => {
    const pending = this.pendingSubscription();

    if (!pending || this.isPendingPaymentExpired(pending)) {
      return null;
    }

    return pending.payment_link || null;
  });

  readonly pendingPlanName = computed(() => {
    const pending = this.pendingSubscription();

    if (!pending || this.isPendingPaymentExpired(pending)) {
      return 'Plano';
    }

    return pending.plan_name || 'Plano';
  });

  readonly pendingBillingType = computed(() => {
    const pending = this.pendingSubscription();

    if (!pending || this.isPendingPaymentExpired(pending) || !pending.billing_type) {
      return '';
    }

    return this.getBillingTypeLabel(pending.billing_type);
  });

  readonly pendingCreditCardInfo = computed(() => {
    const pending = this.pendingSubscription();

    if (!pending || this.isPendingPaymentExpired(pending) || !pending.credit_card_last4) {
      return null;
    }

    return {
      brand: pending.credit_card_brand || 'Cartão',
      last4: pending.credit_card_last4,
    };
  });

  readonly pendingHasDiscount = computed(() => {
    const pending = this.pendingSubscription();

    if (!pending || this.isPendingPaymentExpired(pending)) {
      return false;
    }

    return (pending.discount_cents ?? 0) > 0 || !!pending.coupon_code;
  });

  readonly pendingDiscountAmount = computed(() => {
    const pending = this.pendingSubscription();

    if (!pending || this.isPendingPaymentExpired(pending)) {
      return 0;
    }

    return pending.discount_cents ?? 0;
  });

  readonly pendingCouponCode = computed(() => {
    const pending = this.pendingSubscription();

    if (!pending || this.isPendingPaymentExpired(pending)) {
      return '';
    }

    return pending.coupon_code ?? '';
  });

  readonly finalPendingAmount = computed(() => {
    return Math.max(0, this.pendingPaymentAmount() - this.pendingDiscountAmount());
  });

  readonly pendingPaymentRemainingFormatted = computed(() => {
    const totalSeconds = this.pendingPaymentRemainingSeconds();

    if (totalSeconds <= 0) {
      return '00:00:00';
    }

    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds].map((value) => value.toString().padStart(2, '0')).join(':');
  });

  // =========================================================
  // DATA DOS COMPONENTES
  // =========================================================

  readonly pendingPaymentData = computed<PendingPaymentData>(() => ({
    isPending: this.isPaymentPending(),

    loading: this.isPendingSubscriptionLoading(),

    subscription: this.pendingSubscription(),

    planName: this.pendingPlanName(),

    billingType: this.pendingBillingType(),

    creditCardInfo: this.pendingCreditCardInfo(),

    createdDate: this.pendingPaymentCreatedDate(),

    expiresAt: this.pendingPaymentExpiresAt(),

    remainingTime: this.pendingPaymentRemainingFormatted(),

    amount: this.pendingPaymentAmount(),

    discount: this.pendingDiscountAmount(),

    finalAmount: this.finalPendingAmount(),

    hasDiscount: this.pendingHasDiscount(),

    couponCode: this.pendingCouponCode(),

    paymentLink: this.pendingPaymentLink(),
  }));

  readonly currentPlanData = computed<CurrentPlanData>(() => ({
    isPending: this.isPaymentPending(),

    loading: this.isPendingSubscriptionLoading(),

    name: this.currentPlanName(),

    description: this.currentPlanDescription(),

    hasNoPlan: this.hasNoPlan(),

    type: this.planType(),

    statusLabel: this.getStatusLabel(),

    statusMessage: this.getStatusMessage(),

    statusBadgeClass: this.getStatusBadgeClass(),

    isFreeTrial: this.isFreeTrial(),

    isActive: this.isSubscriptionActive(),

    isExpired: this.isSubscriptionExpired(),

    isCancelled: this.isSubscriptionCancelled(),

    isFailed: this.isSubscriptionFailed(),

    endDate: this.subscriptionEndDate(),

    daysRemaining: this.daysRemaining(),

    paymentMethod: this.paymentMethod(),

    hasActivePlan: this.hasActivePlan(),

    progressPercentage: this.calculateProgressPercentage(),

    progressColor: this.getProgressColor(),

    features: this.currentPlanFeatures(),
  }));

  readonly featuresData = computed<FeaturesData>(() => ({
    isPending: this.isPaymentPending(),

    hasNoPlan: this.hasNoPlan(),

    features: this.currentPlanFeatures(),
  }));

  // =========================================================
  // LIFECYCLE
  // =========================================================

  ngOnInit(): void {
    this.checkForPendingSubscription();
  }

  ngOnDestroy(): void {
    this.stopPendingExpirationTimer();
  }

  // =========================================================
  // PAGAMENTO PENDENTE
  // =========================================================

  private checkForPendingSubscription(): void {
    this.isPendingSubscriptionLoading.set(true);

    this.clientService.checkPendingSubscription().subscribe({
      next: (response: PendingSubscription | null) => {
        if (!response) {
          this.clearPendingSubscription();
          return;
        }

        if (this.isPendingPaymentExpired(response)) {
          this.clearPendingSubscription();
          return;
        }

        this.pendingSubscription.set(response);

        this.startPendingExpirationTimer(response);

        toast.info('Você tem um pagamento pendente', {
          description: `Plano: ${response.plan_name}`,
          duration: 5000,
        });

        this.isPendingSubscriptionLoading.set(false);
      },

      error: (error) => {
        console.error('Erro ao verificar pagamento pendente:', error);

        this.clearPendingSubscription();
      },
    });
  }

  private clearPendingSubscription(): void {
    this.pendingSubscription.set(null);

    this.pendingPaymentRemainingSeconds.set(0);

    this.stopPendingExpirationTimer();

    this.isPendingSubscriptionLoading.set(false);
  }

  // =========================================================
  // EXPIRAÇÃO DO LINK
  // =========================================================

  private getPendingExpirationDate(pending: PendingSubscription): string | null {
    if (!pending.payment_link_created_at) {
      return null;
    }

    return this.addHoursToDate(pending.payment_link_created_at, 24);
  }

  private addHoursToDate(dateValue: string, hours: number): string {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    date.setTime(date.getTime() + hours * 60 * 60 * 1000);

    return date.toISOString();
  }

  private isPendingPaymentExpired(pending: PendingSubscription): boolean {
    const expirationValue = this.getPendingExpirationDate(pending);

    if (!expirationValue) {
      return false;
    }

    const expirationDate = new Date(expirationValue);

    if (Number.isNaN(expirationDate.getTime())) {
      return false;
    }

    return Date.now() >= expirationDate.getTime();
  }

  private calculateRemainingSeconds(pending: PendingSubscription): number {
    const expirationValue = this.getPendingExpirationDate(pending);

    if (!expirationValue) {
      return 0;
    }

    const expirationDate = new Date(expirationValue);

    if (Number.isNaN(expirationDate.getTime())) {
      return 0;
    }

    const difference = expirationDate.getTime() - Date.now();

    return Math.max(0, Math.floor(difference / 1000));
  }

  private startPendingExpirationTimer(pending: PendingSubscription): void {
    this.stopPendingExpirationTimer();

    const initialSeconds = this.calculateRemainingSeconds(pending);

    this.pendingPaymentRemainingSeconds.set(initialSeconds);

    if (initialSeconds <= 0) {
      this.expirePendingPayment();
      return;
    }

    this.pendingExpirationTimer = setInterval(() => {
      const currentPending = this.pendingSubscription();

      if (!currentPending) {
        this.stopPendingExpirationTimer();
        return;
      }

      const remaining = this.calculateRemainingSeconds(currentPending);

      this.pendingPaymentRemainingSeconds.set(remaining);

      if (remaining <= 0) {
        this.expirePendingPayment();
      }
    }, 1000);
  }

  private expirePendingPayment(): void {
    this.pendingPaymentRemainingSeconds.set(0);

    this.pendingSubscription.set(null);

    this.stopPendingExpirationTimer();

    toast.info('O pagamento pendente expirou', {
      description: 'Você já pode realizar uma nova assinatura.',
      duration: 5000,
    });
  }

  private stopPendingExpirationTimer(): void {
    if (this.pendingExpirationTimer !== null) {
      clearInterval(this.pendingExpirationTimer);

      this.pendingExpirationTimer = null;
    }
  }

  // =========================================================
  // AÇÕES
  // =========================================================

  completePendingPayment(): void {
    const pending = this.pendingSubscription();

    if (!pending || this.isPendingPaymentExpired(pending)) {
      this.expirePendingPayment();
      return;
    }

    if (pending.payment_link) {
      window.open(pending.payment_link, '_blank', 'noopener,noreferrer');

      return;
    }

    toast.error('Link de pagamento não disponível', {
      description: 'Entre em contato com o suporte.',
    });
  }

  // =========================================================
  // CANCELAMENTO
  // =========================================================

  cancelSubscriptionOrPaymentLink(): void {
    const loadingToast = toast.loading('Cancelando assinatura...');

    this.clientService.cancelSubscriptionOrPaymentLink().subscribe({
      next: (response) => {
        console.log('Cancelamento realizado:', response);

        /*
         * O pagamento pendente não existe mais.
         */
        this.clearPendingSubscription();

        /*
         * O ClientService já atualiza o
         * AuthState após o cancelamento.
         *
         * Portanto NÃO chamamos refreshProfile()
         * aqui.
         *
         * Quando AuthState.user() mudar,
         * todos os computed() acima serão
         * recalculados automaticamente.
         */

        toast.success('Assinatura cancelada com sucesso!', {
          description: 'Sua assinatura foi cancelada.',
          id: loadingToast,
        });
      },

      error: (error) => {
        console.error('Erro ao cancelar:', error);

        toast.error('Não foi possível cancelar', {
          description: 'Tente novamente em alguns instantes.',
          id: loadingToast,
        });
      },
    });
  }

  // =========================================================
  // NAVEGAÇÃO
  // =========================================================

  goToChangePlan(): void {
    if (this.isPaymentPending()) {
      toast.error('Você tem um pagamento pendente', {
        description: 'Finalize o pagamento antes de alterar seu plano.',
      });

      return;
    }

    this.router.navigate(['/client/billing/change-plan']);
  }

  goToSelectPlan(): void {
    if (this.isPaymentPending()) {
      toast.error('Você tem um pagamento pendente', {
        description: 'Finalize o pagamento antes de contratar um novo plano.',
      });

      return;
    }

    this.router.navigate(['/client/billing/change-plan']);
  }

  // =========================================================
  // RENOVAÇÃO
  // =========================================================

  renewSubscription(): void {
    if (!this.canRenewSubscription()) {
      toast.error('Não é possível renovar a assinatura no momento', {
        description: 'Verifique o status da sua assinatura.',
      });

      return;
    }

    const loadingToast = toast.loading('Aguarde, tentando renovar assinatura...', {
      description: '',
    });

    this.paymentService.renewPlan().subscribe({
      next: () => {
        toast.success('Assinatura renovada com sucesso!', {
          description: 'Obrigado por continuar conosco.',
          id: loadingToast,
        });

        this.checkForPendingSubscription();

        /*
         * A renovação também precisa refletir
         * no usuário atual.
         */
        this.clientService.refreshProfile();
      },

      error: (error) => {
        toast.error('Erro ao renovar assinatura', {
          description: 'Tente novamente ou entre em contato com o suporte.',
          id: loadingToast,
        });

        console.error('Erro ao renovar assinatura', error);
      },
    });
  }

  // =========================================================
  // STATUS
  // =========================================================

  getStatusLabel(): string {
    if (this.isPaymentPending()) {
      return 'Pagamento Pendente';
    }

    if (this.hasNoPlan()) {
      return 'Sem assinatura';
    }

    const status = this.user()?.active_plan?.status;

    const statusMap: Record<string, string> = {
      ativa: 'Ativo',

      'aguardando pagamento': 'Aguardando Pagamento',

      cancelada: 'Cancelado',

      expirada: 'Expirado',

      falhou: 'Falhou',

      teste: 'Período liberado',
    };

    return statusMap[status ?? ''] || 'Desconhecido';
  }

  getStatusMessage(): string {
    if (this.isPaymentPending()) {
      const pending = this.pendingSubscription();

      return (
        `Você tem um pagamento pendente para o plano ` +
        `"${pending?.plan_name}". ` +
        `Finalize o pagamento para ativar seu acesso premium.`
      );
    }

    if (this.hasNoPlan()) {
      return (
        'Você não possui uma assinatura ativa no momento. ' +
        'Escolha um plano para continuar aproveitando ' +
        'os recursos do Rencard.'
      );
    }

    if (this.isFreeTrial()) {
      return (
        'Você está aproveitando um mês liberado. ' +
        'Durante esse período, você pode personalizar seu perfil da forma que quiser. ' +
        'Lembre-se: seu cartão é vitalício e, em caso de alterações no painel, você deverá recorrer à assinatura.'
      );
    }

    const status = this.user()?.active_plan?.status;

    const messages: Record<string, string> = {
      ativa: 'Sua assinatura está ativa e funcionando normalmente',

      'aguardando pagamento':
        'Seu pagamento está pendente. Finalize o pagamento para manter o acesso',

      cancelada: 'Sua assinatura foi cancelada',

      expirada: 'Sua assinatura expirou. Renove agora para continuar usando os recursos premium',

      falhou: 'Ocorreu um erro com sua assinatura. Entre em contato com o suporte',
    };

    return messages[status ?? ''] || 'Status desconhecido';
  }

  getStatusBadgeClass(): string {
    if (this.isPaymentPending()) {
      return 'bg-neutral-700 text-neutral-50';
    }

    if (this.hasNoPlan()) {
      return 'bg-neutral-500 text-neutral-50';
    }

    const status = this.user()?.active_plan?.status;

    const badgeMap: Record<string, string> = {
      ativa: 'bg-neutral-900 text-neutral-50',

      'aguardando pagamento': 'bg-neutral-700 text-neutral-50',

      cancelada: 'bg-neutral-600 text-neutral-50',

      expirada: 'bg-neutral-700 text-neutral-50',

      falhou: 'bg-neutral-600 text-neutral-50',

      teste: 'bg-neutral-800 text-neutral-50',
    };

    return badgeMap[status ?? ''] || 'bg-neutral-500 text-neutral-50';
  }

  // =========================================================
  // PROGRESSO
  // =========================================================

  getProgressColor(): string {
    const remaining = this.daysRemaining();

    if (remaining > 15) {
      return 'bg-neutral-800';
    }

    if (remaining > 7) {
      return 'bg-neutral-600';
    }

    return 'bg-neutral-500';
  }

  calculateProgressPercentage(): number {
    if (this.hasNoPlan()) {
      return 0;
    }

    if (this.isFreeTrial()) {
      return 100;
    }

    const remaining = this.daysRemaining();

    const percentage = ((30 - remaining) / 30) * 100;

    return Math.min(100, Math.max(0, percentage));
  }

  // =========================================================
  // HELPERS
  // =========================================================

  private getBillingTypeLabel(billingType: string): string {
    const billingTypeMap: Record<string, string> = {
      CREDIT_CARD: 'Cartão de Crédito',

      PIX: 'PIX',

      BOLETO: 'Boleto',

      BANK_TRANSFER: 'Transferência Bancária',
    };

    return billingTypeMap[billingType] || billingType;
  }
}
