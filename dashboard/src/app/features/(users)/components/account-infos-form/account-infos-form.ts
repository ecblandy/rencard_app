import { Component, effect, inject, signal } from '@angular/core';

import { disabled, form, submit } from '@angular/forms/signals';

import { SurfaceTitle } from '../surface-title/surface-title';
import { UiLabel } from '../../../../shared/ui/label/label';
import { UiInput } from '../../../../shared/ui/input/input';
import { UiButton } from '../../../../shared/ui/button/button';
import { Surface } from '../../../../shared/components/surface/surface';
import { Auth } from '../../../auth/services/facade/auth';
import { AuthState } from '../../../auth/services/state/auth/auth-state';
import { ChangeEmailModal } from '../change-email-modal/change-email-modal';
import { ChangePasswordModal } from '../change-password-modal/change-password-modal';
import { Loader } from '../../../../shared/components/loader/loader';
import { DashboardTitle } from '../dashboard-title/dashboard-title';

interface AccountInfosModel {
  cpf_cnpj: string;
  phone_number: string;
  full_name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-account-infos-form',
  imports: [
    SurfaceTitle,
    Surface,
    UiLabel,
    UiInput,
    UiButton,
    ChangeEmailModal,
    Loader,
    ChangePasswordModal,
  ],
  templateUrl: './account-infos-form.html',
  styleUrl: './account-infos-form.css',
})
export class AccountInfosForm {
  private readonly authService = inject(Auth);
  private readonly authState = inject(AuthState);

  isInitialLoading = signal(true);

  accountInfosModel = signal<AccountInfosModel>({
    cpf_cnpj: '',
    phone_number: '',
    full_name: '',
    email: '',
    password: '',
  });

  accountInfosForm = form(this.accountInfosModel, (schema) => {
    disabled(schema.email, () => true);
    disabled(schema.password, () => true);
  });

  emailModalOpen = signal(false);
  passwordModalOpen = signal(false);

  constructor() {
    effect(() => {
      const user = this.authState.user();

      if (!user) {
        return;
      }

      this.accountInfosModel.set({
        cpf_cnpj: user.cpf_cnpj || '',
        phone_number: user.phone_number || '',
        full_name: user.full_name || '',
        email: user.email || '',
        password: '',
      });
    });
  }

  ngOnInit() {
    this.authService.loadUser().subscribe({
      error: (err) => {
        console.error('Erro ao carregar usuário:', err);

        this.isInitialLoading.set(false);
      },

      complete: () => {
        this.isInitialLoading.set(false);
      },
    });
  }

  openEmailModal() {
    this.emailModalOpen.set(true);
  }

  openPasswordModal() {
    this.passwordModalOpen.set(true);
  }

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.accountInfosForm, async () => {
      const payload = {
        cpf_cnpj: this.accountInfosModel().cpf_cnpj,
        phone_number: this.accountInfosModel().phone_number,
        full_name: this.accountInfosModel().full_name,
      };

      console.log('Atualizando informações da conta:', payload);

      // Aqui entra sua chamada:
      //
      // await firstValueFrom(
      //   this.authService.updateUser(payload)
      // );
    });
  }
}
