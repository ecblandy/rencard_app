import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { catchError, map, of } from 'rxjs';
import { ClientService } from '../../services/facade/client.service';

interface PendingSubscription {
  id: number;
  plan: number;
  plan_price: number;
  plan_name: string;
  status: string;
  payment_link: string | null;
  billing_type: string;
  credit_card_last4: string;
  credit_card_brand: string;
  coupon_code: string;
  discount_cents: number;
  current_period_start: string;
  current_period_end: string;
  canceled_at: string | null;
}

export const pendingSubscriptionGuard: CanActivateFn = () => {
  const clientService = inject(ClientService);
  const router = inject(Router);

  return clientService.checkPendingSubscription().pipe(
    map((response) => {
      const pending = response as PendingSubscription | null;

      /*
       * Se existe uma assinatura pendente,
       * o usuário não pode criar outra.
       */
      if (pending && pending.status === 'pending') {
        return router.createUrlTree(['/client/billing/preview']);
      }

      /*
       * Não existe assinatura pendente.
       * Pode entrar no checkout.
       */
      return true;
    }),

    /*
     * Se a API falhar, não bloqueamos o checkout.
     *
     * O usuário ainda poderá tentar criar a assinatura.
     */
    catchError((error) => {
      console.error('Erro ao verificar assinatura pendente:', error);

      return of(true);
    }),
  );
};
