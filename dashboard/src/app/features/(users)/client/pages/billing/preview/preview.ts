import { Component, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthState } from '../../../../../auth/services/state/auth/auth-state';
import { Loader } from '../../../../../../shared/components/loader/loader';
import { Surface } from '../../../../../../shared/components/surface/surface';
import { NgIcon } from '@ng-icons/core';
import { UiButton } from '../../../../../../shared/ui/button/button';
import { DashboardTitle } from '../../../../components/dashboard-title/dashboard-title';
import { LocalDatePipe } from '../../../../../../shared/pipes/local-date.pipe.ts-pipe';
import { PaymentService } from '../../../../../(onboarding)/services/facade/payment.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-preview',
  imports: [Loader, Surface, NgIcon, UiButton, DashboardTitle, LocalDatePipe],
  templateUrl: './preview.html',
  styleUrl: './preview.css',
})
export class Preview {
  private readonly authState = inject(AuthState);
  private readonly paymentService = inject(PaymentService);

  private readonly router = inject(Router);
  readonly user = this.authState.user; // signal<UserRegistration | null>
  signalTeste = signal({
    name: '',
  });

  signalForm = form(this.signalTeste);

  ngOnInit() {
    console.log('user', this.user());
  }

  goToChangePlan() {
    this.router.navigate(['/client/billing/change-plan']);
  }

  renewSubscription() {
    const loadingToast = toast.loading('Aguarde, tentando criar cupom...', {
      description: '',
    });
    this.paymentService.renewPlan().subscribe({
      next: (response) => {
        toast.success('Assinatura renovada com sucesso!', {
          description: '',
          id: loadingToast,
        });
      },
      error: (error) => {
        toast.error('Erro ao renovar assinatura', {
          description: '',
          id: loadingToast,
        });
        console.error('Erro ao renovar assinatura', error);
      },
    });
  }
}
