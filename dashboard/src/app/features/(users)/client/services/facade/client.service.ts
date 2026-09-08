import { inject, Injectable } from '@angular/core';
import { map, switchMap, tap } from 'rxjs';

import { ClientApi } from '../api/client-api';

import { SocialLink } from '../../../../../shared/types/profile-model';

import { ProfileStore } from '../../pages/profile/services/store/profile.store';

import { CreateSubscriptionRequest } from '../../types/pending-subscription';

import { Auth } from '../../../../auth/services/facade/auth';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly api = inject(ClientApi);
  private readonly profileStore = inject(ProfileStore);
  private readonly auth = inject(Auth);

  // =========================================================
  // PLANO DO CLIENTE
  // =========================================================

  getClientPlan() {
    return this.api.clientPlan().pipe(
      tap({
        next: (response) => {
          console.log('Client Plan Response:', response);
        },

        error: (error) => {
          console.error('Client Plan Error:', error);
        },
      }),
    );
  }

  // =========================================================
  // REDES SOCIAIS
  // =========================================================

  enableSocials(socials: SocialLink[]) {
    return this.api.enableSocials(socials).pipe(
      tap({
        next: (response) => {
          console.log('Enable Socials Response:', response);
        },

        error: (error) => {
          console.error('Enable Socials Error:', error);
        },
      }),
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  fetchDashboardDetails(period: 'today' | '7d' | '30d') {
    return this.api.dashboardDetails(period).pipe(
      tap({
        next: (response) => {
          console.log('Dashboard Details Response:', response);
        },

        error: (error) => {
          console.error('Dashboard Details Error:', error);
        },
      }),
    );
  }

  // =========================================================
  // PERFIL
  // =========================================================

  updateProfileField(field: string, value: string) {
    return this.api.updateProfileField(field, value).pipe(
      tap((response) => {
        this.profileStore.setProfileFromAPI(response);
      }),
    );
  }

  updateMusic(payload: { value: string; enabled: boolean }) {
    return this.api.updateMusic(payload).pipe(
      tap((response) => {
        this.profileStore.setProfileFromAPI(response);
      }),
    );
  }

  updateResume(payload: {
    file: File | null;
    enabled: boolean;
  }) {
    return this.api.updateResume(payload).pipe(
      tap((response) => {
        this.profileStore.setProfileFromAPI(response);
      }),
    );
  }

  // =========================================================
  // PLANOS
  // =========================================================

  fetchPlans() {
    console.log(
      '1 - Entrou no ClientService.fetchPlans()',
    );

    return this.api.fetchPlans().pipe(
      tap({
        next: (response) => {
          console.log(
            '2 - Resposta da API:',
            response,
          );
        },

        error: (error) => {
          console.error(
            '2 - Erro na API:',
            error,
          );
        },
      }),
    );
  }

  // =========================================================
  // CRIAR ASSINATURA
  // =========================================================

  createSubscription(
    data: CreateSubscriptionRequest,
  ) {
    return this.api.createSubscription(data).pipe(
      tap({
        next: (response) => {
          console.log(
            '3 - Resposta da API ao criar assinatura:',
            response,
          );
        },

        error: (error) => {
          console.error(
            '3 - Erro na API ao criar assinatura:',
            error,
          );
        },
      }),
    );
  }

  // =========================================================
  // PAGAMENTO PENDENTE
  // =========================================================

  checkPendingSubscription() {
    console.log(
      '4 - Entrou no ClientService.checkPendingSubscription()',
    );

    return this.api.checkPendingSubscription().pipe(
      tap({
        next: (response) => {
          console.log(
            '5 - Resposta da API ao verificar assinatura pendente:',
            response,
          );
        },

        error: (error) => {
          console.error(
            '5 - Erro na API ao verificar assinatura pendente:',
            error,
          );
        },
      }),
    );
  }

  // =========================================================
  // ATUALIZAR USUÁRIO
  // =========================================================

  refreshProfile() {
    console.log(
      '6 - Recarregando usuário autenticado...',
    );

    return this.auth.loadUser().pipe(
      tap({
        next: (user) => {
          console.log(
            '7 - Usuário atualizado:',
            user,
          );
        },

        error: (error) => {
          console.error(
            '7 - Erro ao atualizar usuário:',
            error,
          );
        },
      }),
    );
  }

  // =========================================================
  // CANCELAMENTO
  // =========================================================

  cancelSubscriptionOrPaymentLink() {
    console.log(
      '8 - Entrou no ClientService.cancelSubscriptionOrPaymentLink()',
    );

    return this.api
      .cancelSubscriptionOrPaymentLink()
      .pipe(
        tap((response) => {
          console.log(
            '9 - Resposta da API ao cancelar assinatura ou link:',
            response,
          );
        }),

        /*
         * Depois que o backend cancela:
         *
         * 1. Busca o usuário novamente.
         * 2. Auth.loadUser() atualiza o AuthState.
         * 3. Os computed() do Preview são recalculados.
         */

        switchMap((response) => {
          console.log(
            '10 - Recarregando usuário após cancelamento...',
          );

          return this.auth.loadUser().pipe(
            tap((user) => {
              console.log(
                '11 - Usuário atualizado após cancelamento:',
                user,
              );
            }),

            /*
             * Mantém a resposta original
             * do cancelamento.
             */
            map(() => response),
          );
        }),
      );
  }
}
