import { Component, signal, effect, inject } from '@angular/core';
import { Surface } from '../../../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../../../components/surface-title/surface-title';
import { SOCIALS_CARD, SocialsFormModel, SocialsModel } from './socials.config';
import { NgIcon } from '@ng-icons/core';
import { SwitchButton } from '../../../../../../../shared/components/switch-button/switch-button';
import { UiInput } from '../../../../../../../shared/ui/input/input';
import { form } from '@angular/forms/signals';
import { UiButton } from '../../../../../../../shared/ui/button/button';
import { ProfileStore } from '../../services/store/profile.store';
import { ClientService } from '../../../../services/facade/client.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-socials',
  imports: [Surface, SurfaceTitle, NgIcon, SwitchButton, UiInput, UiButton],
  templateUrl: './socials.html',
  styleUrl: './socials.css',
})
export class Socials {
  private readonly clientServices = inject(ClientService);
  profileStore = inject(ProfileStore);
  socials = signal<SocialsModel[]>(SOCIALS_CARD);

  socialsModel = signal<SocialsFormModel>({
    instagram: '',
    tiktok: '',
    linkedin: '',
    facebook: '',
    youtube: '',
    telegram: '',
    email: '',
    x: '',
    website: '',
    spotify: '',
  });

  socialsForm = form(this.socialsModel, (schema) => {});

  private initialized = false;

  constructor() {
    // 1. Hidrata UMA VEZ quando o profile REAL chega do backend
    effect(() => {
      const profile = this.profileStore.profile();

      // id === 0 significa que ainda é o EMPTY_PROFILE (backend não respondeu)
      if (this.initialized || !profile?.id) return;

      this.initialized = true;

      const keyMap: Record<string, keyof SocialsFormModel> = {
        linkedin: 'linkedin',
      };

      const model: SocialsFormModel = {
        instagram: '',
        tiktok: '',
        linkedin: '',
        facebook: '',
        youtube: '',
        telegram: '',
        email: '',
        x: '',
        website: '',
        spotify: '',
      };

      (profile.social_links ?? []).forEach((link) => {
        const key = keyMap[link.type] ?? (link.type as keyof SocialsFormModel);
        if (key in model) model[key] = link.value;
      });

      this.socialsModel.set(model);

      this.socials.update((list) =>
        list.map((social) => {
          const fromBackend = (profile.social_links ?? []).find(
            (l) => (keyMap[l.type] ?? l.type) === social.key,
          );
          return fromBackend ? { ...social, enabled: fromBackend.enabled } : social;
        }),
      );
    });

    // 2. Sincroniza formulário → store para preview (sem ler profile, sem loop)
    effect(() => {
      const socialsArray = this.socials();

      const socials_list = socialsArray.map((social) => {
        const fieldFn = this.socialsForm[
          social.key as keyof SocialsFormModel
        ] as unknown as () => any;
        const value = typeof fieldFn === 'function' ? (fieldFn()?.value?.() ?? '') : '';

        return {
          id: 0,
          type: social.key,
          value,
          icon: social.icon,
          enabled: social.enabled,
        };
      });

      this.profileStore.updateProfile({ social_links: socials_list });
    });
  }

  // Atualiza `socials` imutavelmente quando trocar o switch
  toggleEnabled(index: number, value: boolean) {
    this.socials.update((list) =>
      list.map((item, i) => (i === index ? { ...item, enabled: value } : item)),
    );
  }

  // Pega o value seguro do FieldState ou do socialsModel (fallback)
  private getFieldValue(key: keyof SocialsFormModel): string {
    const fieldFn = this.socialsForm[key] as unknown as () => any;
    if (typeof fieldFn === 'function') {
      try {
        const state = fieldFn();
        return typeof state?.value === 'function' ? (state.value() ?? '') : '';
      } catch {
        return this.socialsModel()[key] ?? '';
      }
    }
    return this.socialsModel()[key] ?? '';
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const socialsArray = this.socials();

    // Valida manualmente só os habilitados
    const invalid = socialsArray
      .filter((s) => s.enabled)
      .filter((s) => {
        const value = this.getFieldValue(s.key as keyof SocialsFormModel);
        return !value || value.trim().length < 3;
      });

    if (invalid.length > 0) {
      const labels = invalid.map((s) => s.label).join(', ');
      toast.error('Preencha corretamente', {
        description: `Mínimo 3 caracteres em: ${labels}`,
      });
      return;
    }

    // Envia habilitadas (enabled: true) E desabilitadas que tenham valor (enabled: false),
    // para o backend saber que foram desligadas.
    const social_links_payload = socialsArray
      .map((s) => {
        let value = (this.getFieldValue(s.key as keyof SocialsFormModel) ?? '').trim();

        if (s.key === 'email' && value && !value.startsWith('mailto:')) {
          value = `mailto:${value}`;
        }

        return {
          id: 0,
          type: s.key,
          value,
          enabled: s.enabled, // 👈 respeita o estado real do switch
        };
      })
      .filter((s) => s.enabled || s.value.length > 0);

    const loadingToast = toast.loading('Aguarde, tentando atualizar...', { description: '' });

    this.clientServices.enableSocials(social_links_payload).subscribe({
      next: () => {
        toast.success('Pronto! Tudo atualizado.', {
          description: 'Redes sociais atualizadas com sucesso!',
          id: loadingToast,
        });
      },
      error: (error) => {
        console.error('Erro ao atualizar redes sociais:', error);
        toast.error('Ops! Algo deu errado.', {
          description: 'Não foi possível atualizar suas redes sociais. Tente novamente.',
          id: loadingToast,
        });
      },
    });
  }
}
