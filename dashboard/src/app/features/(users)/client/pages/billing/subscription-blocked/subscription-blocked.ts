import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { RouterLink } from '@angular/router';

type SubscriptionBlockedStatus =
  | 'none'
  | 'expirada'
  | 'cancelada'
  | 'falhou'
  | 'aguardando_pagamento';

@Component({
  selector: 'app-subscription-blocked',
  standalone: true,
  imports: [NgIcon, RouterLink],
  templateUrl: './subscription-blocked.html',
  styleUrl: './subscription-blocked.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionBlocked {
  readonly status = input<SubscriptionBlockedStatus>('none');

  getTitle(): string {
    switch (this.status()) {
      case 'expirada':
        return 'Sua assinatura expirou';

      case 'cancelada':
        return 'Sua assinatura foi cancelada';

      case 'falhou':
        return 'Problema com sua assinatura';

      case 'aguardando_pagamento':
        return 'Pagamento pendente';

      case 'none':
      default:
        return 'Assinatura necessária';
    }
  }

  getDescription(): string {
    switch (this.status()) {
      case 'expirada':
        return 'Sua assinatura chegou ao fim. Renove seu plano para continuar utilizando este recurso.';

      case 'cancelada':
        return 'Sua assinatura foi cancelada e o acesso a este recurso está indisponível. Escolha um plano para continuar.';

      case 'falhou':
        return 'Não foi possível manter sua assinatura ativa. Verifique sua assinatura e escolha um plano para continuar.';

      case 'aguardando_pagamento':
        return 'Seu pagamento está pendente. Finalize o processo para continuar utilizando este recurso.';

      case 'none':
      default:
        return 'Você ainda não possui uma assinatura ativa. Escolha um plano para continuar utilizando este recurso.';
    }
  }

  getButtonLabel(): string {
    switch (this.status()) {
      case 'expirada':
      case 'cancelada':
      case 'falhou':
        return 'Renovar assinatura';

      case 'aguardando_pagamento':
        return 'Ver assinatura';

      case 'none':
      default:
        return 'Escolher um plano';
    }
  }
}
