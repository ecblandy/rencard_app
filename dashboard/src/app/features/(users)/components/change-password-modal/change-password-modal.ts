import { Component, effect, inject, input, output, signal } from '@angular/core';
import { form, minLength, required, validate } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';

import { UiInput } from '../../../../shared/ui/input/input';
import { UiLabel } from '../../../../shared/ui/label/label';
import { UiButton } from '../../../../shared/ui/button/button';
import { Modal } from '../../../../shared/ui/modal/modal';

import { formatErrorList } from '../../../../shared/utils/format-error';
import { Auth } from '../../../auth/services/facade/auth';

interface ChangePasswordModel {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

@Component({
  selector: 'app-change-password-modal',
  imports: [UiInput, UiLabel, UiButton, Modal],
  templateUrl: './change-password-modal.html',
  styleUrl: './change-password-modal.css',
})
export class ChangePasswordModal {
  private readonly auth = inject(Auth);

  isOpen = input<boolean>(false);
  close = output<void>();

  isSubmitting = signal(false);

  changePasswordModel = signal<ChangePasswordModel>({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  changePasswordForm = form(this.changePasswordModel, (schemaPath) => {
    required(schemaPath.current_password, {
      message: 'A senha atual é obrigatória.',
    });

    required(schemaPath.new_password, {
      message: 'A nova senha é obrigatória.',
    });

    minLength(schemaPath.new_password, 8, {
      message: 'A nova senha deve ter pelo menos 8 caracteres.',
    });

    required(schemaPath.confirm_password, {
      message: 'Confirme a nova senha.',
    });

    validate(schemaPath.confirm_password, ({ value, valueOf }) => {
      const newPassword = valueOf(schemaPath.new_password);

      return value() === newPassword
        ? null
        : {
            kind: 'mismatch',
            message: 'As senhas não coincidem.',
          };
    });
  });

  constructor() {
    // Sempre que o modal fechar, reseta o formulário.
    effect(() => {
      if (!this.isOpen()) {
        this.changePasswordModel.set({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });

        this.isSubmitting.set(false);
      }
    });
  }

  submit(event: Event) {
    event.preventDefault();

    if (this.changePasswordForm().invalid()) {
      return;
    }

    const { current_password, new_password } = this.changePasswordModel();

    this.isSubmitting.set(true);

    const loadingToast = toast.loading('Alterando senha...');

    firstValueFrom(this.auth.changePassword(current_password, new_password))
      .then(() => {
        toast.success('Senha alterada com sucesso!', {
          id: loadingToast,
        });

        this.close.emit();
      })
      .catch((err: any) => {
        const backendError = err?.error ?? err;
        const errorMessages = formatErrorList(backendError);

        toast.error('Não foi possível alterar a senha.', {
          description: errorMessages.join('\n'),
          id: loadingToast,
        });
      })
      .finally(() => {
        this.isSubmitting.set(false);
      });
  }

  onClose() {
    this.close.emit();
  }
}
