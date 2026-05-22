import { Component, computed, effect, inject, signal } from '@angular/core';
import { Surface } from '../../../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../../../components/surface-title/surface-title';
import { UiButton } from '../../../../../../../shared/ui/button/button';
import { NgIcon } from '@ng-icons/core';
import { SwitchButton } from '../../../../../../../shared/components/switch-button/switch-button';
import { ClientService } from '../../../../services/facade/client.service';
import { toast } from 'ngx-sonner';
import { ProfileStore } from '../../services/store/profile.store';

export type FormModel = Record<'form', string>;

export interface Model {
  key: string;
  label: string;
  icon: string;
  enabled: boolean;
}

export const FORM_CARD = {
  key: 'form',
  label: 'Exibir formulário de contato',
  value: '',
  icon: 'lucideContact',
  enabled: false,
};

@Component({
  selector: 'app-form',
  imports: [Surface, SurfaceTitle, UiButton, NgIcon, SwitchButton],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  private clientService = inject(ClientService);
  profileStore = inject(ProfileStore);

  formLabels = signal(['Nome completo', 'E-mail', 'Telefone', 'Mensagem', 'Localização']);
  isSaving = signal(false);
  localEnabled = signal<boolean | null>(null);

  contactEnabled = computed(() => this.profileStore.profile().contact_enabled);
  effectiveEnabled = computed(() => this.localEnabled() ?? this.contactEnabled());
  hasChanges = computed(
    () => this.localEnabled() !== null && this.localEnabled() !== this.contactEnabled(),
  );
  constructor() {
    console.log('Store instance ID:', (this.profileStore as any)._id ?? 'sem id');
    console.log('contact_enabled:', this.profileStore.profile().contact_enabled);
  }

  toggleEnabled() {
    this.localEnabled.set(!this.effectiveEnabled());
  }

  save() {
    this.isSaving.set(true);
    const loadingToast = toast.loading('Aguarde, tentando atualizar...', { description: '' });

    this.clientService
      .updateProfileField('contact_enabled', String(this.effectiveEnabled()))
      .subscribe({
        next: () => {
          this.profileStore.updateProfile({ contact_enabled: this.effectiveEnabled() });
          this.localEnabled.set(null); // reseta — store agora é a fonte da verdade
          toast.success('Pronto! Tudo atualizado.', {
            description: 'Formulário atualizado com sucesso!',
            id: loadingToast,
          });
          this.isSaving.set(false);
        },
        error: () => {
          this.localEnabled.set(null); // reverte
          toast.error('Erro ao atualizar!', {
            description: 'Ocorreu um erro ao tentar habilitar o formulário.',
            id: loadingToast,
          });
          this.isSaving.set(false);
        },
      });
  }
}
