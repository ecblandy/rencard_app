import { Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';

import { Loader } from '../../../../../shared/components/loader/loader';
import { UiButton } from '../../../../../shared/ui/button/button';
import { Auth } from '../../../../auth/services/facade/auth';
import { AuthState } from '../../../../auth/services/state/auth/auth-state';
import { PaymentService } from '../../../../(onboarding)/services/facade/payment.service';

@Component({
  selector: 'app-onboarding-pending-payment',
  imports: [Loader, UiButton],
  templateUrl: './onboarding-pending-payment.html',
  styleUrl: './onboarding-pending-payment.css',
})
export class OnboardingPendingPayment {
  private readonly paymentService = inject(PaymentService);
  private readonly auth = inject(Auth);
  private readonly authState = inject(AuthState);
  private readonly router = inject(Router);

  readonly isLoading = signal(true);
  readonly isRedirecting = signal(false);
  readonly isCheckingStatus = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly checkoutUrl = signal<string | null>(null);

  constructor() {
    this.loadCheckoutLink();
  }

  // =========================================================
  // CORRIGE O ESTADO AO VOLTAR PELO HISTÓRICO DO NAVEGADOR
  // =========================================================

  @HostListener('window:pageshow')
  onPageShow() {
    this.isRedirecting.set(false);
  }

  // =========================================================
  // BUSCA O LINK DE PAGAMENTO
  // O endpoint de resume reaproveita o checkout existente
  // quando ele ainda é válido ou cria um novo quando necessário.
  // =========================================================

  private loadCheckoutLink() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.isRedirecting.set(false);

    this.paymentService.resumeOnboardingPayment().subscribe({
      next: (response) => {
        this.checkoutUrl.set(response.checkout_url);
        this.isLoading.set(false);
      },

      error: (error) => {
        console.error('Erro ao buscar link de pagamento pendente:', error);

        this.checkoutUrl.set(null);

        this.errorMessage.set(
          'Não foi possível carregar o link de pagamento agora. Tente novamente em instantes.',
        );

        this.isLoading.set(false);
      },
    });
  }

  // =========================================================
  // TENTAR NOVAMENTE
  // =========================================================

  retry() {
    this.loadCheckoutLink();
  }

  // =========================================================
  // IR PARA O PAGAMENTO
  // Checkout externo — não usa Router do Angular.
  // =========================================================

  goToPayment() {
    const url = this.checkoutUrl();

    if (!url || this.isRedirecting()) {
      return;
    }

    this.isRedirecting.set(true);

    window.location.assign(url);
  }

  // =========================================================
  // "JÁ PAGUEI" — VERIFICA O STATUS NOVAMENTE
  // O pagamento só é considerado confirmado depois que o backend
  // recebe/processa a confirmação da Asaas.
  // =========================================================

  refreshStatus() {
    if (this.isCheckingStatus()) {
      return;
    }

    this.isCheckingStatus.set(true);

    this.auth.loadUser().subscribe({
      next: (user) => {
        this.isCheckingStatus.set(false);

        if (user.onboarding?.next_action !== 'resume_payment') {
          toast.success('Pagamento confirmado!');

          this.router.navigate(['/client/dashboard']);

          return;
        }

        toast.info('Ainda não identificamos a confirmação do pagamento.');
      },

      error: (error) => {
        console.error('Erro ao verificar status do pagamento:', error);

        this.isCheckingStatus.set(false);

        toast.error('Não foi possível verificar o status agora.');
      },
    });
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  logout() {
    this.authState.clear();

    this.router.navigate(['/auth/signin']);
  }
}
