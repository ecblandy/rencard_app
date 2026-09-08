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
import { Button } from '../../../../../../../shared/types/profile-model';

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
    // HIDRATA COM DADOS DA API
    effect(() => {
      const apiButtons = this.profileStore.profile().buttons;

      if (apiButtons && apiButtons.length > 0) {
        // Atualiza o signal buttons com dados reais da API
        this.buttons.update((current) =>
          current.map((btn) => {
            const apiBtn = apiButtons.find((b) => b.type === btn.key);
            return {
              ...btn,
              value: apiBtn?.value ?? '',
              enabled: apiBtn?.enabled ?? false,
            };
          }),
        );

        // Atualiza o model do form
        this.buttonsModel.set({
          whatsapp: apiButtons.find((b) => b.type === 'whatsapp')?.value ?? '',
          pix: apiButtons.find((b) => b.type === 'pix')?.value ?? '',
        });
      }
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
      next: () => {
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

  getMask(key: string): string {
    if (key === 'whatsapp') {
      return '(00) 00000-0000';
    }
    return ''; // Sem máscara para PIX
  }
}
