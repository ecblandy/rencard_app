import { Component, signal, effect, inject } from '@angular/core';
import { Surface } from '../../../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../../../components/surface-title/surface-title';
import { BUTTONS_CARD, ButtonsFormModel, ButtonsModel } from './buttons.config';
import { NgIcon } from '@ng-icons/core';
import { SwitchButton } from '../../../../../../../shared/components/switch-button/switch-button';
import { UiInput } from '../../../../../../../shared/ui/input/input';
import { form } from '@angular/forms/signals';
import { UiButton } from '../../../../../../../shared/ui/button/button';
import { ProfileStore } from '../../services/store/profile.store';
import { toast } from 'ngx-sonner';
import { ProfileService } from '../../services/facade/profile.service';
import { Button } from '../../../../../../../shared/types/profile-model'; // ← adicionado

@Component({
  selector: 'app-buttons',
  imports: [Surface, SurfaceTitle, NgIcon, SwitchButton, UiInput, UiButton],
  templateUrl: './buttons.html',
  styleUrl: './buttons.css',
})
export class Buttons {
  private readonly profileServices = inject(ProfileService);
  profileStore = inject(ProfileStore);
  buttons = signal<ButtonsModel[]>(BUTTONS_CARD);

  buttonsModel = signal<ButtonsFormModel>({
    whatsapp: '',
    pix: '',
  });

  buttonsForm = form(this.buttonsModel, (schema) => {});

  constructor() {
    effect(() => {
      const buttonsArray = this.buttons();

      const buttons_list: Button[] = buttonsArray.map((button) => {
        const fieldFn = this.buttonsForm[
          button.key as keyof ButtonsFormModel
        ] as unknown as () => any;
        const value = typeof fieldFn === 'function' ? (fieldFn()?.value?.() ?? '') : '';

        return {
          id: 0,
          type: button.key,
          value,
          enabled: button.enabled,
        };
      });

      this.profileStore.setButtons(buttons_list);
    });
  }

  toggleEnabled(index: number, value: boolean) {
    this.buttons.update((list) =>
      list.map((item, i) => (i === index ? { ...item, enabled: value } : item)),
    );
  }

  private getFieldValue(key: keyof ButtonsFormModel): string {
    const fieldFn = this.buttonsForm[key] as unknown as () => any;
    if (typeof fieldFn === 'function') {
      try {
        const state = fieldFn();
        return typeof state?.value === 'function' ? (state.value() ?? '') : '';
      } catch {
        return this.buttonsModel()[key] ?? '';
      }
    }
    return this.buttonsModel()[key] ?? '';
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const buttonsArray = this.buttons();
    const enabledButtons = buttonsArray.filter((b) => b.enabled);

    const invalid = enabledButtons.filter((b) => {
      const value = this.getFieldValue(b.key as keyof ButtonsFormModel);
      return !value || value.trim().length < 3;
    });

    if (invalid.length > 0) {
      const labels = invalid.map((b) => b.label).join(', ');
      toast.error('Preencha corretamente', {
        description: `Mínimo 3 caracteres em: ${labels}`,
      });
      return;
    }

    const payload = enabledButtons.map((b) => ({
      type: b.key,
      value: this.getFieldValue(b.key as keyof ButtonsFormModel),
      enabled: true,
    }));

    const loadingToast = toast.loading('Aguarde, tentando atualizar...', { description: '' });

    this.profileServices.updateButtons(payload).subscribe({
      // ← corrigido
      next: () => {
        this.profileStore.setButtons(payload);
        toast.success('Pronto! Tudo atualizado.', {
          description: 'Botões atualizados com sucesso!',
          id: loadingToast,
        });
      },
      error: (error) => {
        console.error('Erro ao atualizar botões:', error);
        toast.error('Ops! Algo deu errado.', {
          description: 'Não foi possível atualizar seus botões. Tente novamente.',
          id: loadingToast,
        });
      },
    });
  }
}
