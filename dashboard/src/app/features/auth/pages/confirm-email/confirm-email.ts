import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, maxLength, min, minLength, required, submit } from '@angular/forms/signals';
import { AuthForm } from '../../../../shared/components/auth-form/auth-form';
import { UiButton } from '../../../../shared/ui/button/button';
import { UiInput } from '../../../../shared/ui/input/input';
import { UiLabel } from '../../../../shared/ui/label/label';
import { Auth } from '../../services/facade/auth';
import { AuthState } from '../../services/state/auth/auth-state';
import { SignupState } from '../../services/state/signup/signup-state';
import { toast } from 'ngx-sonner';
import { firstValueFrom } from 'rxjs';
import { formatErrorList } from '../../../../shared/utils/format-error';

// Components

interface ConfirmEmailModel {
  code: string;
}

@Component({
  selector: 'app-confirm-email',
  imports: [UiButton, UiLabel, UiInput, AuthForm],
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.css',
})
export class ConfirmEmail {
  private auth = inject(Auth);

  private router = inject(Router);

  confirmEmailModel = signal<ConfirmEmailModel>({ code: '' });
  confirmEmailForm = form(this.confirmEmailModel, (schemaPath) => {
    required(schemaPath.code, { message: 'O código é obrigatório.' });
    minLength(schemaPath.code, 6, { message: 'O código deve ter 6 números.' });
    maxLength(schemaPath.code, 6, { message: 'O código deve ter 6 números.' });
  });

  originRoute = signal<string>('');

  constructor() {
    const navState = history.state?.from;
    if (navState) this.originRoute.set(navState);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.confirmEmailForm, async (form) => {
      const { code } = form().value();
      console.log(code);
      const loadingToast = toast.loading('Enviando código...');
      try {
        await firstValueFrom(this.auth.confirmEmail(code));

        toast.success('Verificação Concluída!', {
          description: 'Seu e-mail foi verificado com sucesso.',
          id: loadingToast,
        });

        this.router.navigate(['/onboarding/']);
        return;
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
}
