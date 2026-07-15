import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, maxLength, minLength, required, submit, email } from '@angular/forms/signals';
import { AuthForm } from '../../../../shared/components/auth-form/auth-form';
import { UiButton } from '../../../../shared/ui/button/button';
import { UiInput } from '../../../../shared/ui/input/input';
import { UiLabel } from '../../../../shared/ui/label/label';
import { Auth } from '../../services/facade/auth';
import { toast } from 'ngx-sonner';
import { firstValueFrom } from 'rxjs';
import { formatErrorList } from '../../../../shared/utils/format-error';
import { Modal } from '../../../../shared/ui/modal/modal';
import { AuthState } from '../../services/state/auth/auth-state';
import { PaymentService } from '../../../(onboarding)/services/facade/payment.service';

interface ConfirmEmailModel {
  code: string;
}

interface ChangeEmailModel {
  email: string;
}

@Component({
  selector: 'app-confirm-email',
  imports: [UiButton, UiLabel, UiInput, AuthForm, Modal],
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.css',
})
export class ConfirmEmail {
  private auth = inject(Auth);
  private router = inject(Router);
  private authState = inject(AuthState);
  private paymentService = inject(PaymentService);

  confirmEmailModel = signal<ConfirmEmailModel>({ code: '' });
  confirmEmailForm = form(this.confirmEmailModel, (schemaPath) => {
    required(schemaPath.code, { message: 'O código é obrigatório.' });
    minLength(schemaPath.code, 6, { message: 'O código deve ter 6 números.' });
    maxLength(schemaPath.code, 6, { message: 'O código deve ter 6 números.' });
  });

  isChangeEmailOpen = signal(false);
  changeEmailModel = signal<ChangeEmailModel>({ email: '' });
  changeEmailForm = form(this.changeEmailModel, (schemaPath) => {
    required(schemaPath.email, { message: 'O e-mail é obrigatório.' });
    email(schemaPath.email, { message: 'Digite um e-mail válido.' });
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
      const currentEmail = this.authState.user()?.email;

      const loadingToast = toast.loading('Enviando código...');
      try {
        // 1. Confirma o e-mail
        await firstValueFrom(this.auth.confirmEmail(code, currentEmail));

        // 2. Busca o carrinho salvo no localStorage
        const stored = JSON.parse(localStorage.getItem('temporaryCart') ?? 'null');
        if (!stored?.id) {
          toast.success('E-mail confirmado!', { id: loadingToast });
          this.router.navigate(['/onboarding/']);
          return;
        }

        // 3. Busca o carrinho atualizado
        const cart = await firstValueFrom(this.paymentService.getTemporaryCartById(stored.id));

        // 4. Cria a ordem
        const orderPayload = {
          postal_code: cart.postal_code,
          shipping_service_code: cart.shipping_service_code,
          items: cart.items.map((item: any) => ({
            product: item.product,
            quantity: item.quantity,
          })),
          ...(cart.coupon_code ? { coupon_code: cart.coupon_code } : {}),
        };

        let order;
        try {
          order = await firstValueFrom(this.paymentService.createOrder(orderPayload));
          localStorage.removeItem('temporaryCart');

          // salva o pedido de forma persistente pra checkout ler depois
          localStorage.setItem('pendingOrder', JSON.stringify(order));
        } catch (orderErr: any) {
          const backendError = orderErr?.error ?? orderErr;
          const errorMessages = formatErrorList(backendError);
          toast.error('E-mail confirmado, mas houve um erro ao criar seu pedido.', {
            description: errorMessages.join('\n'),
            id: loadingToast,
          });
          return;
        }

        toast.success('Verificação Concluída!', {
          description: 'Pedido criado com sucesso.',
          id: loadingToast,
        });

        this.router.navigate(['/onboarding/checkout']);
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

  openChangeEmailModal() {
    this.changeEmailModel.set({ email: '' });
    this.isChangeEmailOpen.set(true);
  }

  closeChangeEmailModal() {
    this.isChangeEmailOpen.set(false);
  }

  onChangeEmailSubmit(event: Event) {
    event.preventDefault();
    submit(this.changeEmailForm, async (form) => {
      const { email: newEmail } = form().value();
      const loadingToast = toast.loading('Atualizando e-mail...');
      try {
        await firstValueFrom(this.auth.changeEmail(newEmail));

        toast.success('E-mail atualizado!', {
          description: 'Enviamos um novo código para o e-mail informado.',
          id: loadingToast,
        });

        this.closeChangeEmailModal();
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
