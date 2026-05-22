import { Component, inject, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { UiButton } from '../../../../../shared/ui/button/button';
import { UiInput } from '../../../../../shared/ui/input/input';
import { UiLabel } from '../../../../../shared/ui/label/label';
import { Surface } from '../../../../../shared/components/surface/surface';
import { Loader } from '../../../../../shared/components/loader/loader';
import { form, required, submit, validate } from '@angular/forms/signals';
import { Auth } from '../../../../auth/services/facade/auth';
import { toast } from 'ngx-sonner';
import { firstValueFrom } from 'rxjs';
import { formatErrorList } from '../../../../../shared/utils/format-error';

@Component({
  selector: 'app-apps',
  imports: [NgIcon, UiButton, UiInput, UiLabel, Surface, Loader],
  templateUrl: './apps.html',
  styleUrl: './apps.css',
})
export class Apps {
  private readonly authService = inject(Auth);
  isLoading = signal<boolean>(false);

  analyticsState = signal({
    google_analytics_id: '',
  });

  analyticsForm = form(this.analyticsState, (schema) => {
    required(schema.google_analytics_id, { message: 'O campo é obrigatório.' });

    validate(schema.google_analytics_id, ({ value }) => {
      const analyticsId = value();
      const googleAnalyticsPattern = /^\d{10}$/;

      if (!googleAnalyticsPattern.test(analyticsId)) {
        return {
          kind: 'invalidFormat',
          message: 'Formato inválido. Use: G-1234567890 (10 dígitos)',
        };
      }

      return null;
    });
  });

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.analyticsForm, async () => {
      const loadingToast = toast.loading('Salvando...', {
        description: '',
      });

      try {
        const state = this.analyticsState();

        const payload = {
          ...state,
          google_analytics_id: `G-${state.google_analytics_id}`,
        };

        console.log(payload);

        await firstValueFrom(this.authService.updateUser(payload));

        toast.success('Sucesso!', {
          description: 'ID salvo',
          id: loadingToast,
        });
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

  constructor() {
    this.loadAnalyticField();
  }

  private loadAnalyticField() {
    this.isLoading.set(true);
    this.authService.loadUser().subscribe({
      next: (user) =>
        this.analyticsState.set({
          google_analytics_id: user.google_analytics_id || '',
        }),
      error: console.error,
      complete: () => this.isLoading.set(false),
    });
  }
}
