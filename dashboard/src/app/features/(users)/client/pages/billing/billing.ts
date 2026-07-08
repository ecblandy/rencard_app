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
import { Loader } from '../../../../../shared/components/loader/loader';
import { LocalDatePipe } from '../../../../../shared/pipes/local-date.pipe.ts-pipe';

@Component({
  selector: 'app-billing',
  imports: [RouterOutlet],
  templateUrl: './billing.html',
  styleUrl: './billing.css',
})
export class Billing {}
