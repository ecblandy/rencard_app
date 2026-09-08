import { Component, inject, signal } from '@angular/core';

import { NgIcon } from '@ng-icons/core';

import { form, required, submit, validate } from '@angular/forms/signals';

import { firstValueFrom } from 'rxjs';

import { toast } from 'ngx-sonner';

import { UiButton } from '../../../../../shared/ui/button/button';
import { UiInput } from '../../../../../shared/ui/input/input';
import { UiLabel } from '../../../../../shared/ui/label/label';
import { Surface } from '../../../../../shared/components/surface/surface';
import { Loader } from '../../../../../shared/components/loader/loader';

import { Auth } from '../../../../auth/services/facade/auth';

import { formatErrorList } from '../../../../../shared/utils/format-error';

import { SubscriptionAccessService } from '../../../../../shared/services/subscription-access';

import { SubscriptionBlocked } from '../billing/subscription-blocked/subscription-blocked';

@Component({
  selector: 'app-apps',
  standalone: true,
  imports: [NgIcon, UiButton, UiInput, UiLabel, Surface, Loader, SubscriptionBlocked],
  templateUrl: './apps.html',
  styleUrl: './apps.css',
})
export class Apps {
  private readonly authService = inject(Auth);

  protected readonly subscriptionAccess = inject(SubscriptionAccessService);

  readonly isLoading = signal(false);

  readonly analyticsState = signal({
    google_analytics_id: '',
  });

  readonly analyticsForm = form(this.analyticsState, (schema) => {
    /**
     * Campo obrigatório
     */
    required(schema.google_analytics_id, {
      message: 'Informe o ID de medição.',
    });

    /**
     * Validação do ID de medição do Google Analytics 4.
     *
     * Formato esperado:
     *
     * G-QYWB792MLT
     *
     * O prefixo G- é obrigatório.
     */
    validate(schema.google_analytics_id, ({ value }) => {
      const analyticsId = value().trim().toUpperCase();

      const googleAnalyticsPattern = /^G-[A-Z0-9]+$/;

      if (!googleAnalyticsPattern.test(analyticsId)) {
        return {
          kind: 'invalidFormat',
          message: 'ID inválido. Use o formato G-QYWB792MLT.',
        };
      }

      return null;
    });
  });

  constructor() {
    this.loadAnalyticField();
  }

  /**
   * Salva o ID de medição do Google Analytics.
   */
  onSubmit(event: Event): void {
    event.preventDefault();

    submit(this.analyticsForm, async () => {
      const loadingToast = toast.loading('Salvando...');

      try {
        const analyticsId = this.analyticsState().google_analytics_id.trim().toUpperCase();

        const payload = {
          google_analytics_id: analyticsId,
        };

        console.log('Google Analytics:', payload);

        await firstValueFrom(this.authService.updateUser(payload));

        /**
         * Mantém o estado atualizado com o valor
         * salvo no backend.
         */
        this.analyticsState.set({
          google_analytics_id: analyticsId,
        });

        toast.success('Configuração salva!', {
          description: 'Seu ID do Google Analytics foi salvo com sucesso.',
          id: loadingToast,
        });
      } catch (err: any) {
        console.error('Erro ao salvar Google Analytics:', err);

        const backendError = err?.error ?? err;

        const errorMessages = formatErrorList(backendError);

        toast.error('Ops, algo deu errado!', {
          description: errorMessages.join('\n'),
          id: loadingToast,
        });
      }
    });
  }

  /**
   * Carrega o ID de medição já salvo no perfil do usuário.
   */
  private loadAnalyticField(): void {
    this.isLoading.set(true);

    this.authService.loadUser().subscribe({
      next: (user) => {
        const googleAnalyticsId = user.google_analytics_id?.trim().toUpperCase() || '';

        this.analyticsState.set({
          google_analytics_id: googleAnalyticsId,
        });
      },

      error: (error) => {
        console.error('Erro ao carregar usuário:', error);

        this.isLoading.set(false);
      },

      complete: () => {
        this.isLoading.set(false);
      },
    });
  }
}
