import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, maxLength, minLength, required, submit } from '@angular/forms/signals';

import { AuthForm } from '../../../../shared/components/auth-form/auth-form';
import { UiButton } from '../../../../shared/ui/button/button';
import { UiInput } from '../../../../shared/ui/input/input';
import { UiLabel } from '../../../../shared/ui/label/label';

import { Auth } from '../../services/facade/auth';
import { toast } from 'ngx-sonner';
import { firstValueFrom, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { formatErrorList } from '../../../../shared/utils/format-error';
import { AuthState } from '../../services/state/auth/auth-state';
import { PaymentService } from '../../../(onboarding)/services/facade/payment.service';

interface ConfirmEmailModel {
  code: string;
}

type ConfirmationType = 'registration' | 'change-email';

@Component({
  selector: 'app-confirm-email',
  imports: [UiButton, UiLabel, UiInput, AuthForm],
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.css',
})
export class ConfirmEmail {
  private auth = inject(Auth);
  private router = inject(Router);
  private authState = inject(AuthState);
  private paymentService = inject(PaymentService);

  confirmEmailModel = signal<ConfirmEmailModel>({
    code: '',
  });

  confirmEmailForm = form(this.confirmEmailModel, (schemaPath) => {
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

  resendCountdown = signal<number>(0);
  isResending = signal(false);
  canResendCode = signal(true);

  confirmationType = signal<ConfirmationType>('registration');

  pendingEmail = signal<string>('');

  constructor() {
    this.detectConfirmationType();
  }

  private detectConfirmationType() {
    const type = sessionStorage.getItem('emailConfirmationType') as ConfirmationType | null;

    /*
     * =========================================================
     * TROCA DE E-MAIL
     * =========================================================
     */

    if (type === 'change-email') {
      const pendingEmail = sessionStorage.getItem('pendingEmail') ?? '';

      this.confirmationType.set('change-email');
      this.pendingEmail.set(pendingEmail);

      console.log('📧 Confirmando troca de e-mail:', pendingEmail);

      return;
    }

    /*
     * =========================================================
     * CADASTRO
     * =========================================================
     */

    const pendingEmail = localStorage.getItem('pendingEmail');

    const userEmail = this.authState.user()?.email || '';

    this.confirmationType.set('registration');

    this.pendingEmail.set(pendingEmail || userEmail);

    console.log('📝 Confirmando cadastro:', pendingEmail || userEmail);
  }

  private getCurrentEmail(): string {
    return this.pendingEmail();
  }

  /**
   * Mascara o e-mail apenas para EXIBIÇÃO na tela.
   *
   * O valor real continua em `pendingEmail()` (sem alteração)
   * e é o que é utilizado em todas as chamadas ao backend
   * (resendCode, confirmEmail, changeEmail, etc).
   *
   * Exemplo: "joana.silva@gmail.com" -> "jo***********@gm***.com"
   */
  maskedEmail(): string {
    const email = this.pendingEmail();

    if (!email || !email.includes('@')) {
      return email;
    }

    const [user, domain] = email.split('@');
    const domainParts = domain.split('.');
    const domainName = domainParts[0] ?? '';
    const tld = domainParts.slice(1).join('.');

    const maskPart = (part: string) => {
      if (!part) return part;
      if (part.length <= 2) {
        return part[0] + '*'.repeat(Math.max(part.length - 1, 1));
      }
      return part.slice(0, 2) + '*'.repeat(part.length - 2);
    };

    const maskedDomain = tld ? `${maskPart(domainName)}.${tld}` : maskPart(domainName);

    return `${maskPart(user)}@${maskedDomain}`;
  }

  /**
   * Cria o pedido a partir do carrinho temporário.
   *
   * Esse método é utilizado tanto no fluxo de cadastro
   * quanto no fluxo de troca de e-mail.
   */
  private async createOrderFromTemporaryCart() {
    const stored = JSON.parse(localStorage.getItem('temporaryCart') ?? 'null');

    /*
     * ---------------------------------------------------------
     * SEM CARRINHO
     * ---------------------------------------------------------
     */

    if (!stored?.id) {
      return null;
    }

    /*
     * ---------------------------------------------------------
     * RECUPERA CARRINHO
     * ---------------------------------------------------------
     */

    const cart = await firstValueFrom(this.paymentService.getTemporaryCartById(stored.id));

    /*
     * ---------------------------------------------------------
     * PAYLOAD DO PEDIDO
     * ---------------------------------------------------------
     */

    const orderPayload = {
      postal_code: cart.postal_code,

      shipping_service_code: cart.shipping_service_code,

      items: cart.items.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
      })),

      ...(cart.coupon_code
        ? {
            coupon_code: cart.coupon_code,
          }
        : {}),
    };

    /*
     * ---------------------------------------------------------
     * CRIA PEDIDO
     * ---------------------------------------------------------
     */

    const order = await firstValueFrom(this.paymentService.createOrder(orderPayload));

    /*
     * O carrinho temporário não é mais necessário
     * depois que o pedido foi criado.
     */
    localStorage.removeItem('temporaryCart');

    /*
     * Guarda o pedido para a tela de checkout.
     */
    localStorage.setItem('pendingOrder', JSON.stringify(order));

    return order;
  }

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.confirmEmailForm, async (form) => {
      const { code } = form().value();

      const currentEmail = this.getCurrentEmail();
      const type = this.confirmationType();

      console.log('📤 Confirmando e-mail:', {
        currentEmail,
        code,
        type,
      });

      /*
       * =======================================================
       * VALIDAÇÃO
       * =======================================================
       */

      if (!currentEmail) {
        toast.error('E-mail não encontrado. Por favor, refaça o processo.');

        return;
      }

      const loadingToast = toast.loading('Verificando código...');

      try {
        /*
         * =====================================================
         * CONFIRMAÇÃO
         * =====================================================
         *
         * Aqui tratamos apenas a confirmação.
         *
         * Depois disso os dois fluxos continuam para o mesmo
         * processo de criação do pedido.
         */

        if (type === 'change-email') {
          await firstValueFrom(this.auth.confirmChangeEmail(code));

          /*
           * Atualiza o usuário para que o novo e-mail
           * apareça imediatamente no estado da aplicação.
           */
          await firstValueFrom(this.auth.loadUser());

          /*
           * O novo e-mail já foi confirmado.
           */
          sessionStorage.removeItem('emailConfirmationType');

          sessionStorage.removeItem('pendingEmail');
        } else {
          /*
           * ===================================================
           * CADASTRO
           * ===================================================
           */

          await firstValueFrom(this.auth.confirmEmail(code, currentEmail));

          /*
           * O e-mail usado durante o cadastro não é
           * mais necessário.
           */
          localStorage.removeItem('pendingEmail');

          /*
           * Limpa qualquer estado antigo.
           */
          sessionStorage.removeItem('emailConfirmationType');

          sessionStorage.removeItem('pendingEmail');
        }

        /*
         * =====================================================
         * CRIAÇÃO DO PEDIDO
         * =====================================================
         *
         * A partir daqui o fluxo é EXATAMENTE o mesmo
         * independente de onde a confirmação veio.
         */

        const order = await this.createOrderFromTemporaryCart();

        /*
         * =====================================================
         * SEM PEDIDO
         * =====================================================
         */

        if (!order) {
          toast.success(
            type === 'change-email' ? 'E-mail confirmado com sucesso!' : 'E-mail confirmado!',
            {
              description: 'Não encontramos um pedido pendente.',
              id: loadingToast,
            },
          );

          this.router.navigate(['/onboarding/']);

          return;
        }

        /*
         * =====================================================
         * CHECKOUT
         * =====================================================
         */

        toast.success(
          type === 'change-email' ? 'E-mail confirmado com sucesso!' : 'Verificação concluída!',
          {
            description: 'Pedido criado com sucesso.',
            id: loadingToast,
          },
        );

        /*
         * Os dois fluxos terminam aqui.
         */
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

  async resendCode() {
    const currentEmail = this.getCurrentEmail();

    const type = this.confirmationType();

    /*
     * Para ambos os fluxos precisamos saber
     * qual e-mail receberá o código.
     */
    if (!currentEmail) {
      toast.error('E-mail não encontrado. Por favor, refaça o processo.');

      return;
    }

    console.log('🔄 Reenviando código:', {
      currentEmail,
      type,
    });

    this.isResending.set(true);

    const loadingToast = toast.loading('Reenviando código...');

    try {
      /*
       * =====================================================
       * CADASTRO
       * =====================================================
       */

      if (type === 'registration') {
        await firstValueFrom(this.auth.resendConfirmationCode(currentEmail));
      } else {
        /*
         * ===================================================
         * TROCA DE E-MAIL
         * ===================================================
         */

        await firstValueFrom(this.auth.changeEmail(currentEmail));
      }

      toast.success('Código reenviado!', {
        description: `Verifique seu e-mail: ${this.maskedEmail()}`,
        id: loadingToast,
      });

      this.startResendCountdown();
    } catch (err: any) {
      const backendError = err?.error ?? err;

      const errorMessages = formatErrorList(backendError);

      toast.error('Erro ao reenviar código!', {
        description: errorMessages.join('\n'),
        id: loadingToast,
      });
    } finally {
      this.isResending.set(false);
    }
  }

  private startResendCountdown() {
    this.canResendCode.set(false);

    this.resendCountdown.set(60);

    interval(1000)
      .pipe(takeWhile(() => this.resendCountdown() > 0))
      .subscribe(() => {
        this.resendCountdown.update((count) => count - 1);

        if (this.resendCountdown() === 0) {
          this.canResendCode.set(true);
        }
      });
  }

  changeEmail() {
    this.router.navigate(['/auth/change-email']);
  }
}
