import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { email, form, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';

import { UiButton } from '../../../../shared/ui/button/button';
import { UiInput } from '../../../../shared/ui/input/input';
import { AuthForm } from '../../../../shared/components/auth-form/auth-form';
import { UiLabel } from '../../../../shared/ui/label/label';

import { Auth } from '../../services/facade/auth';
import { formatErrorList } from '../../../../shared/utils/format-error';

interface ForgotPasswordModel {
  email: string;
}

@Component({
  selector: 'app-forgot-password',
  imports: [AuthForm, UiLabel, UiInput, UiButton],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  isSubmitting = signal(false);

  // Depois de enviar, mostramos uma tela de confirmação.
  linkSent = signal(false);

  forgotPasswordModel = signal<ForgotPasswordModel>({
    email: '',
  });

  forgotPasswordForm = form(this.forgotPasswordModel, (schemaPath) => {
    required(schemaPath.email, {
      message: 'O e-mail é obrigatório.',
    });

    email(schemaPath.email, {
      message: 'Insira um endereço de e-mail válido.',
    });
  });

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.forgotPasswordForm().invalid()) {
      return;
    }

    const { email: userEmail } = this.forgotPasswordModel();

    this.isSubmitting.set(true);

    const loadingToast = toast.loading('Enviando instruções...');

    firstValueFrom(this.auth.requestPasswordReset(userEmail))
      .then(() => {
        this.linkSent.set(true);

        toast.success('E-mail enviado!', {
          description: `Verifique a caixa de entrada de ${userEmail}.`,
          id: loadingToast,
        });
      })
      .catch((err: any) => {
        const backendError = err?.error ?? err;
        const errorMessages = formatErrorList(backendError);

        toast.error('Não foi possível enviar o e-mail.', {
          description: errorMessages.join('\n'),
          id: loadingToast,
        });
      })
      .finally(() => {
        this.isSubmitting.set(false);
      });
  }

  goBack() {
    this.router.navigate(['/auth/login']);
  }
}
