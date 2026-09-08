import { Component, effect, inject, input, output, signal } from '@angular/core';

import { email, form, maxLength, minLength, required, submit } from '@angular/forms/signals';

import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';

import { Modal } from '../../../../shared/ui/modal/modal';
import { UiLabel } from '../../../../shared/ui/label/label';
import { UiInput } from '../../../../shared/ui/input/input';
import { UiButton } from '../../../../shared/ui/button/button';

import { formatErrorList } from '../../../../shared/utils/format-error';

import { Auth } from '../../../auth/services/facade/auth';
import { Loader } from '../../../../shared/components/loader/loader';
import { NgIcon } from '@ng-icons/core';

/* =========================================================
   TYPES
   ========================================================= */

type ChangeEmailStep = 'email' | 'code';

interface NewEmailModel {
  new_email: string;
}

interface CodeModel {
  code: string;
}

/* =========================================================
   COMPONENT
   ========================================================= */

@Component({
  selector: 'app-change-email-modal',

  imports: [Modal, UiLabel, UiInput, UiButton],

  templateUrl: './change-email-modal.html',
  styleUrl: './change-email-modal.css',
})
export class ChangeEmailModal {
  private readonly auth = inject(Auth);

  /* =======================================================
     MODAL
     ======================================================= */

  isOpen = input<boolean>(false);

  close = output<void>();

  /* =======================================================
     STATE
     ======================================================= */

  step = signal<ChangeEmailStep>('email');

  isSubmitting = signal(false);

  pendingNewEmail = signal('');

  /* =======================================================
     STEP 1
     ======================================================= */

  newEmailModel = signal<NewEmailModel>({
    new_email: '',
  });

  newEmailForm = form(this.newEmailModel, (schemaPath) => {
    required(schemaPath.new_email, {
      message: 'O novo e-mail é obrigatório.',
    });

    email(schemaPath.new_email, {
      message: 'Insira um endereço de e-mail válido.',
    });
  });

  /* =======================================================
     STEP 2
     ======================================================= */

  codeModel = signal<CodeModel>({
    code: '',
  });

  codeForm = form(this.codeModel, (schemaPath) => {
    required(schemaPath.code, {
      message: 'O código é obrigatório.',
    });

    minLength(schemaPath.code, 6, {
      message: 'O código deve ter 6 números.',
    });

    maxLength(schemaPath.code, 6, {
      message: 'O código deve ter 6 números.',
    });
  });

  /* =======================================================
     CONSTRUCTOR
     ======================================================= */

  constructor() {
    effect(() => {
      if (!this.isOpen()) {
        this.resetState();
      }
    });
  }

  /* =======================================================
     RESET
     ======================================================= */

  private resetState() {
    this.step.set('email');

    this.isSubmitting.set(false);

    this.pendingNewEmail.set('');

    this.newEmailModel.set({
      new_email: '',
    });

    this.codeModel.set({
      code: '',
    });
  }

  /* =======================================================
     STEP 1
     ======================================================= */

  submitNewEmail(event: Event) {
    event.preventDefault();

    submit(this.newEmailForm, async () => {
      const { new_email } = this.newEmailModel();

      this.isSubmitting.set(true);

      const loadingToast = toast.loading('Enviando código de verificação...');

      try {
        await firstValueFrom(this.auth.changeEmail(new_email));

        this.pendingNewEmail.set(new_email);

        this.step.set('code');

        toast.success('Código enviado!', {
          description: `Verifique a caixa de entrada de ${new_email}.`,

          id: loadingToast,
        });
      } catch (err: any) {
        console.error('Erro ao solicitar alteração de e-mail:', err);

        const backendError = err?.error ?? err;

        const errorMessages = formatErrorList(backendError);

        toast.error('Não foi possível enviar o código.', {
          description: errorMessages.join('\n'),

          id: loadingToast,
        });
      } finally {
        this.isSubmitting.set(false);
      }
    });
  }

  /* =======================================================
     STEP 2
     ======================================================= */

  submitCode(event: Event) {
    event.preventDefault();

    submit(this.codeForm, async () => {
      const { code } = this.codeModel();

      this.isSubmitting.set(true);

      const loadingToast = toast.loading('Confirmando alteração...');

      try {
        await firstValueFrom(this.auth.confirmChangeEmail(code));

        /*
         * Recarrega o usuário para que
         * o novo e-mail apareça imediatamente.
         */
        await firstValueFrom(this.auth.loadUser());

        toast.success('E-mail alterado com sucesso!', {
          id: loadingToast,
        });

        this.close.emit();
      } catch (err: any) {
        console.error('Erro ao confirmar alteração de e-mail:', err);

        const backendError = err?.error ?? err;

        const errorMessages = formatErrorList(backendError);

        toast.error('Não foi possível confirmar o código.', {
          description: errorMessages.join('\n'),

          id: loadingToast,
        });
      } finally {
        this.isSubmitting.set(false);
      }
    });
  }

  /* =======================================================
     BACK
     ======================================================= */

  backToEmailStep() {
    this.step.set('email');

    this.codeModel.set({
      code: '',
    });
  }

  /* =======================================================
     CLOSE
     ======================================================= */

  onClose() {
    this.close.emit();
  }
}
