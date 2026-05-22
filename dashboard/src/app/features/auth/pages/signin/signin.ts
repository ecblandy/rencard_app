import { Component, inject, signal } from '@angular/core';
import { form, required, email, minLength, FormField, submit } from '@angular/forms/signals';

// Components

import { Router, RouterModule } from '@angular/router';

import { firstValueFrom } from 'rxjs';
import { AuthForm } from '../../../../shared/components/auth-form/auth-form';
import { UiButton } from '../../../../shared/ui/button/button';
import { UiInput } from '../../../../shared/ui/input/input';
import { UiLabel } from '../../../../shared/ui/label/label';
import { Auth } from '../../services/facade/auth';
import { toast } from 'ngx-sonner';
import { formatErrorList } from '../../../../shared/utils/format-error';
import { AuthState } from '../../services/state/auth/auth-state';

interface SigninAuth {
  email: string;
  password: string;
}

@Component({
  selector: 'app-signin',
  imports: [AuthForm, UiLabel, UiInput, UiButton, FormField, RouterModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly authState = inject(AuthState);
  signinModel = signal<SigninAuth>({
    email: '',
    password: '',
  });

  signinForm = form(this.signinModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email é obrigatório.' });
    email(schemaPath.email, { message: 'Insira um endereço de e-mail válido.' });

    required(schemaPath.password, { message: 'Senha é obrigatória.' });
    minLength(schemaPath.password, 8, { message: 'A senha deve ter pelo menos 6 caracteres.' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.signinForm, async () => {
      const credentials = this.signinModel();
      const loadingToast = toast.loading('Tentando login...');
      try {
        await firstValueFrom(this.auth.login(credentials));

        toast.success('Sucesso!', {
          description: 'Você foi logado com sucesso.',
          id: loadingToast,
        });

        const user = this.authState.user();
        if (user) {
          this.redirectBasedOnRole(user.role);
        }
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

  private redirectBasedOnRole(role: string) {
    const roleRoutes: Record<string, string> = {
      admin: '/admin/dashboard',
      affiliate: '/affiliate/dashboard',
      client: '/client/dashboard',
    };

    const targetRoute = roleRoutes[role] || '/client/dashboard';
    this.router.navigate([targetRoute]);
  }
}
