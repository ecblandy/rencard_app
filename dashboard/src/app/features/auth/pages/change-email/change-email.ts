import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, required, submit, email } from '@angular/forms/signals';

import { AuthForm } from '../../../../shared/components/auth-form/auth-form';
import { UiButton } from '../../../../shared/ui/button/button';
import { UiInput } from '../../../../shared/ui/input/input';
import { UiLabel } from '../../../../shared/ui/label/label';

import { Auth } from '../../services/facade/auth';
import { toast } from 'ngx-sonner';
import { firstValueFrom } from 'rxjs';
import { formatErrorList } from '../../../../shared/utils/format-error';
import { AuthState } from '../../services/state/auth/auth-state';

interface ChangeEmailModel {
  email: string;
}

@Component({
  selector: 'app-change-email',
  imports: [UiButton, UiLabel, UiInput, AuthForm],
  templateUrl: './change-email.html',
  styleUrl: './change-email.css',
})
export class ChangeEmail {
  private auth = inject(Auth);
  private router = inject(Router);
  private authState = inject(AuthState);

  changeEmailModel = signal<ChangeEmailModel>({
    email: '',
  });

  changeEmailForm = form(this.changeEmailModel, (schemaPath) => {
    required(schemaPath.email, {
      message: 'O e-mail é obrigatório.',
    });

    email(schemaPath.email, {
      message: 'Digite um e-mail válido.',
    });
  });

  currentEmail = signal<string>(this.authState.user()?.email || '');

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.changeEmailForm, async (form) => {
      const { email: newEmail } = form().value();

      const normalizedEmail = newEmail.trim().toLowerCase();

      if (normalizedEmail === this.currentEmail().toLowerCase()) {
        toast.error('O novo e-mail precisa ser diferente do atual.');

        return;
      }

      const loadingToast = toast.loading('Enviando código...');

      try {
        await firstValueFrom(this.auth.changeEmail(normalizedEmail));

        /*
         * Identifica que a tela de confirmação
         * pertence ao fluxo de troca de e-mail.
         */
        sessionStorage.setItem('emailConfirmationType', 'change-email');

        /*
         * Guarda o novo e-mail apenas durante
         * o fluxo de confirmação.
         */
        sessionStorage.setItem('pendingEmail', normalizedEmail);

        toast.success('Código enviado!', {
          description: 'Enviamos um código para o novo e-mail.',
          id: loadingToast,
        });

        this.router.navigate(['/auth/confirm-email']);
      } catch (err: any) {
        const backendError = err?.error ?? err;

        const errorMessages = formatErrorList(backendError);

        toast.error('Ops, algo deu errado!', {
          description: errorMessages.join('\n'),
          id: loadingToast,
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/client/dashboard']);
  }
}
