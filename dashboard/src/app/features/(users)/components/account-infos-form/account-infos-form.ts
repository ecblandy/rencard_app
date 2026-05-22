import { Component, inject, signal } from '@angular/core';
import { SurfaceTitle } from '../surface-title/surface-title';
import { UiLabel } from '../../../../shared/ui/label/label';
import { UiInput } from '../../../../shared/ui/input/input';
import { UiButton } from '../../../../shared/ui/button/button';
import { Surface } from '../../../../shared/components/surface/surface';
import { disabled, form, submit } from '@angular/forms/signals';
import { Auth } from '../../../auth/services/facade/auth';
import { ChangeEmailModal } from '../change-email-modal/change-email-modal';
import { Loader } from '../../../../shared/components/loader/loader';
import { ChangePasswordModal } from '../change-password-modal/change-password-modal';

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

  openEmailModal() {
    this.emailModalOpen.set(true);
  }

  openPasswordModal() {
    this.passwordModalOpen.set(true);
  }

  ngOnInit() {
    this.authService.loadUser().subscribe({
      next: (user) => {
        this.accountInfosModel.set({
          cpf_cnpj: user.cpf_cnpj || '',
          phone_number: user.phone_number || '',
          full_name: user.full_name || '',
          email: user.email || '',
          password: user.password || '',
        });
      },
      error(err) {
        console.error('Erro ao carregar usuário:', err);
      },
      complete: () => this.isInitialLoading.set(false),
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.accountInfosForm, async () => {
      const payload = this.accountInfosModel();
    });
  }
}
