import { Component, effect, inject, signal } from '@angular/core';
import { Surface } from '../../../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../../../components/surface-title/surface-title';
import { NgIcon } from '@ng-icons/core';
import { SwitchButton } from '../../../../../../../shared/components/switch-button/switch-button';
import { UiButton } from '../../../../../../../shared/ui/button/button';
import { UiInput } from '../../../../../../../shared/ui/input/input';
import { MUSIC_CARD, MusicFormModel, MusicModel } from './music.config';
import { toast } from 'ngx-sonner';
import { ClientService } from '../../../../services/facade/client.service';
import { ProfileStore } from '../../services/store/profile.store';
import { form } from '@angular/forms/signals';

@Component({
  selector: 'app-music',
  imports: [Surface, SurfaceTitle, NgIcon, SwitchButton, UiButton, UiInput],
  templateUrl: './music.html',
  styleUrl: './music.css',
})
export class Music {
  private readonly clientServices = inject(ClientService);
  profileStore = inject(ProfileStore);

  music = signal<MusicModel>({ ...MUSIC_CARD });

  musicModel = signal<MusicFormModel>({ music: '' });

  musicForm = form(this.musicModel, (schema) => {});

  constructor() {
    // inicializa com os dados do store
    const storeMusic = this.profileStore.profile().music;

    if (storeMusic) {
      this.music.set({ ...MUSIC_CARD, enabled: storeMusic.enabled });
      this.musicModel.set({ music: storeMusic.value });
    }

    effect(() => {
      const value = this.musicForm.music().value() ?? '';
      this.profileStore.updateMusic(value, this.music().enabled);
    });
  }
  private getFieldValue(): string {
    const state = this.musicForm.music();
    return state.value() ?? '';
  }

  toggleEnabled(value: boolean) {
    this.music.update((item) => ({ ...item, enabled: value }));
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.music().enabled) {
      this.clientServices.updateMusic({ value: '', enabled: false }).subscribe({
        next: () => {
          this.music.update((item) => ({ ...item, enabled: false }));
          toast.success('Pronto! Tudo atualizado.', {
            description: 'Música atualizada com sucesso!',
          });
        },
        error: () => toast.error('Ops! Algo deu errado.', { description: 'Tente novamente.' }),
      });
      return;
    }

    const value = this.getFieldValue();

    if (!value || value.trim().length < 3) {
      toast.error('Preencha corretamente', {
        description: 'Mínimo 3 caracteres no link da música.',
      });
      return;
    }

    const loadingToast = toast.loading('Aguarde, tentando atualizar...', { description: '' });

    this.clientServices.updateMusic({ value, enabled: true }).subscribe({
      next: () => {
        this.music.update((item) => ({ ...item, enabled: true, value }));
        toast.success('Pronto! Tudo atualizado.', {
          description: 'Música atualizada com sucesso!',
          id: loadingToast,
        });
      },
      error: (error: any) => {
        console.error('Erro ao atualizar música:', error);
        toast.error('Ops! Algo deu errado.', {
          description: 'Não foi possível atualizar sua música. Tente novamente.',
          id: loadingToast,
        });
      },
    });
  }
}
