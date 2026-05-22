import { Component, inject, signal } from '@angular/core';
import { Surface } from '../../../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../../../components/surface-title/surface-title';
import { UiButton } from '../../../../../../../shared/ui/button/button';
import { ProfileStore } from '../../services/store/profile.store';
import { FormField, form, submit } from '@angular/forms/signals';
import { SwitchButton } from '../../../../../../../shared/components/switch-button/switch-button';
import { NgIcon } from '@ng-icons/core';
import { ProfileService } from '../../services/facade/profile.service';
import { toast } from 'ngx-sonner';

interface SettingsModel {
  custom_url: string;
}

@Component({
  selector: 'app-settings',
  imports: [Surface, SurfaceTitle, UiButton, FormField, SwitchButton, NgIcon],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  private readonly profileStore = inject(ProfileStore);
  private readonly profileService = inject(ProfileService);

  isPrivate = signal<boolean>(this.profileStore.profile()?.is_private ?? false);
  isPrivateDirty = signal<boolean>(false);

  togglePrivate(value: boolean) {
    this.isPrivate.set(value);
    this.isPrivateDirty.set(value !== (this.profileStore.profile()?.is_private ?? false));
    this.profileStore.updateProfile({ is_private: value });
  }

  settingsModel = signal<SettingsModel>({
    custom_url: this.profileStore.profile()?.custom_url || '',
  });

  settingsForm = form(this.settingsModel);

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.settingsForm, async () => {
      const payload = {
        custom_url: this.settingsModel().custom_url,
        is_private: this.isPrivate(),
      };

      const loadingToast = toast.loading('Salvando configurações...', { description: '' });

      this.profileService.updateSettings(payload).subscribe({
        next: () => {
          toast.success('Pronto! Tudo atualizado.', {
            description: 'Configurações salvas com sucesso!',
            id: loadingToast,
          });
        },
        error: () => {
          toast.error('Ops! Algo deu errado.', {
            description: 'Não foi possível salvar. Tente novamente.',
            id: loadingToast,
          });
        },
      });
    });
  }
}
