import { Component, inject, signal } from '@angular/core';
import { switchMap } from 'rxjs';
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
import { ProfileService } from '../../services/facade/profile.service';
import { form } from '@angular/forms/signals';

@Component({
  selector: 'app-music',
  imports: [Surface, SurfaceTitle, NgIcon, SwitchButton, UiButton, UiInput],
  templateUrl: './music.html',
  styleUrl: './music.css',
})
export class Music {
  private readonly clientService = inject(ClientService);
  private readonly profileService = inject(ProfileService);
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
  }

  private getFieldValue(): string {
    const state = this.musicForm.music();
    return state.value() ?? '';
  }

  /**
   * Salva usando o endpoint original (ClientService) e, em seguida,
   * busca o perfil completo para o store refletir o que realmente
   * foi gravado no backend.
   */
  private saveMusic(value: string, enabled: boolean) {
    return this.clientService
      .updateMusic({ value, enabled })
      .pipe(switchMap(() => this.profileService.fetchProfile()));
  }

  toggleEnabled(value: boolean) {
    this.music.update((item) => ({ ...item, enabled: value }));

    // sincroniza o switch (que lê do store) imediatamente
    const currentMusic = this.profileStore.profile().music;
    this.profileStore.updateMusic(currentMusic?.value ?? this.getFieldValue(), value);
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.music().enabled) {
      const loadingToast = toast.loading('Aguarde, salvando...', { description: '' });

      this.saveMusic('', false).subscribe({
        next: () => {
          this.music.update((item) => ({ ...item, enabled: false }));

          toast.success('Pronto! Tudo atualizado.', {
            description: 'Música atualizada com sucesso!',
            id: loadingToast,
          });
        },
        error: (error) => {
          console.error('[Music] Erro ao salvar:', error);
          toast.error('Ops! Algo deu errado.', {
            description: 'Tente novamente.',
            id: loadingToast,
          });
        },
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

    this.saveMusic(value, true).subscribe({
      next: () => {
        this.music.update((item) => ({ ...item, enabled: true, value }));

        toast.success('Pronto! Tudo atualizado.', {
          description: 'Música atualizada com sucesso!',
          id: loadingToast,
        });
      },
      error: (error) => {
        console.error('[Music] Erro ao salvar:', error);
        toast.error('Ops! Algo deu errado.', {
          description: 'Não foi possível atualizar sua música. Tente novamente.',
          id: loadingToast,
        });
      },
    });
  }
}
