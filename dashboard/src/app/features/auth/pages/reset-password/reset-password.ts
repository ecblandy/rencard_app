import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, minLength, required, validate } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';

import { AuthForm } from '../../../../shared/components/auth-form/auth-form';
import { UiButton } from '../../../../shared/ui/button/button';
import { UiInput } from '../../../../shared/ui/input/input';
import { UiLabel } from '../../../../shared/ui/label/label';

import { Auth } from '../../services/facade/auth';
import { formatErrorList } from '../../../../shared/utils/format-error';

interface ResetPasswordModel {
  new_password: string;
  confirm_password: string;
}

@Component({
  selector: 'app-reset-password',
  imports: [AuthForm, UiLabel, UiInput, UiButton, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);

  isSubmitting = signal(false);

  // uid e token vêm da URL do link enviado por e-mail.
  private uid = signal<string | null>(null);
  private token = signal<string | null>(null);

  // Se o link estiver incompleto/inválido/expirado, bloqueia o formulário.
  linkInvalid = signal(false);

  resetPasswordModel = signal<ResetPasswordModel>({
    new_password: '',
    confirm_password: '',
  });

  resetPasswordForm = form(this.resetPasswordModel, (schemaPath) => {
    required(schemaPath.new_password, {
      message: 'A nova senha é obrigatória.',
    });

    minLength(schemaPath.new_password, 8, {
      message: 'A senha deve ter pelo menos 8 caracteres.',
    });

    required(schemaPath.confirm_password, {
      message: 'Confirme a nova senha.',
    });

    // Só valida o mismatch no campo de confirmação. Como usamos
    // valueOf(new_password) aqui dentro, essa validação já
    // reavalia sozinha sempre que new_password mudar também —
    // não precisa duplicar a regra no outro campo, o que evitaria
    // o erro aparecer embaixo do campo errado.
    validate(schemaPath.confirm_password, ({ value, valueOf }) => {
      const newPassword = valueOf(schemaPath.new_password);
      const confirmPassword = value();

      if (!confirmPassword) {
        return null; // erro de "obrigatório" já cobre isso
      }

      return confirmPassword === newPassword
        ? null
        : { kind: 'mismatch', message: 'As senhas não coincidem.' };
    });
  });

  constructor() {
    const params = this.route.snapshot.queryParamMap;

    const uid = params.get('uid');
    const token = params.get('token');

    if (!uid || !token) {
      this.linkInvalid.set(true);

      toast.error('Link inválido ou incompleto.', {
        description: 'Solicite uma nova redefinição de senha.',
      });

      return;
    }

    this.uid.set(uid);
    this.token.set(token);
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.linkInvalid()) {
      return;
    }

    const uid = this.uid();
    const token = this.token();

    if (!uid || !token) {
      this.linkInvalid.set(true);
      return;
    }

    if (this.resetPasswordForm().invalid()) {
      return;
    }

    const { new_password, confirm_password } = this.resetPasswordModel();

    // Checagem de segurança extra, independente da validação reativa.
    if (new_password !== confirm_password) {
      toast.error('As senhas não coincidem.', {
        description: 'Verifique os campos e tente novamente.',
      });
      return;
    }

    this.isSubmitting.set(true);

    const loadingToast = toast.loading('Redefinindo senha...');

    firstValueFrom(this.auth.confirmPasswordReset(uid, token, new_password))
      .then(() => {
        toast.success('Senha redefinida com sucesso!', {
          description: 'Faça login com sua nova senha.',
          id: loadingToast,
        });

        this.router.navigate(['/auth/login']);
      })
      .catch((err: any) => {
        const backendError = err?.error ?? err;
        const errorMessages = formatErrorList(backendError);

        toast.error('Não foi possível redefinir a senha.', {
          description: errorMessages.join('\n'),
          id: loadingToast,
        });

        /*
         * O uid/token pode ter expirado ou já ter sido usado;
         * bloqueia o formulário e orienta a solicitar um novo link.
         */
        this.linkInvalid.set(true);
      })
      .finally(() => {
        this.isSubmitting.set(false);
      });
  }
}
