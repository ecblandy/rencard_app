import { computed, inject, Injectable } from '@angular/core';

import { AuthState } from '../../features/auth/services/state/auth/auth-state';

export type SubscriptionBlockedStatus =
  | 'none'
  | 'expirada'
  | 'cancelada'
  | 'falhou'
  | 'aguardando_pagamento';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionAccessService {
  private readonly authState = inject(AuthState);

  readonly user = computed(() => this.authState.user());

  readonly activePlan = computed(() => {
    return this.user()?.active_plan ?? null;
  });

  readonly activeAccessGrant = computed(() => {
    return this.user()?.active_access_grant ?? null;
  });

  readonly canAccess = computed(() => {
    const grant = this.activeAccessGrant();
    const plan = this.activePlan();

    /*
     * Um access grant ativo concede acesso,
     * mesmo que não exista active_plan.
     */
    if (grant) {
      return true;
    }

    /*
     * Sem plano e sem access grant:
     * usuário não possui acesso.
     */
    if (!plan) {
      return false;
    }

    const status = String(plan.status ?? '').toLowerCase();

    /*
     * Somente assinaturas em situação de acesso
     * permanecem liberadas.
     */
    return status === 'ativa' || status === 'teste';
  });

  readonly blockedStatus = computed<SubscriptionBlockedStatus>(() => {
    if (this.canAccess()) {
      return 'none';
    }

    const plan = this.activePlan();

    if (!plan) {
      return 'none';
    }

    const status = String(plan.status ?? '').toLowerCase();

    switch (status) {
      case 'expirada':
        return 'expirada';

      case 'cancelada':
        return 'cancelada';

      case 'falhou':
        return 'falhou';

      case 'aguardando pagamento':
      case 'aguardando_pagamento':
      case 'pending':
      case 'pendente':
        return 'aguardando_pagamento';

      default:
        return 'none';
    }
  });
}
