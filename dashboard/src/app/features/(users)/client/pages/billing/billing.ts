import { Component, signal, effect, inject } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { ClientService } from '../../services/facade/client.service';
import { DashboardTitle } from '../../../components/dashboard-title/dashboard-title';
import { Surface } from '../../../../../shared/components/surface/surface';
import { UiButton } from '../../../../../shared/ui/button/button';
import { Auth } from '../../../../auth/services/facade/auth';
import { UserRegistration } from '../../../../../shared/types/user.model';
import { AuthState } from '../../../../auth/services/state/auth/auth-state';
import { NgIcon } from '@ng-icons/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-billing',
  imports: [DashboardTitle, Surface, UiButton, NgIcon, RouterOutlet],
  templateUrl: './billing.html',
  styleUrl: './billing.css',
})
export class Billing {
  private readonly clientService = inject(ClientService);
  private readonly authState = inject(AuthState);
  private readonly router = inject(Router);
  readonly user = this.authState.user; // signal<UserRegistration | null>
  signalTeste = signal({
    name: '',
  });

  signalForm = form(this.signalTeste);

  ngOnInit() {
    this.clientService.getClientPlan().subscribe((response) => {
      console.log('Client Plan Data:', response);
    });
  }

  goToChangePlan() {
    this.router.navigate(['/client/billing/change-plan']);
  }
}
