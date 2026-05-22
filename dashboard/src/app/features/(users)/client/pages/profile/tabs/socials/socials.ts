import { Component, signal, effect, inject } from '@angular/core';
import { Surface } from '../../../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../../../components/surface-title/surface-title';
import { SOCIALS_CARD, SocialsFormModel, SocialsModel } from './socials.config';
import { NgIcon } from '@ng-icons/core';
import { SwitchButton } from '../../../../../../../shared/components/switch-button/switch-button';
import { UiInput } from '../../../../../../../shared/ui/input/input';
import { form, pattern, required, submit } from '@angular/forms/signals';
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
    linkedIn: '',
    facebook: '',
    youtube: '',
    telegram: '',
    email: '',
    x: '',
    website: '',
    spotify: '',
  });

  socialsForm = form(this.socialsModel, (schema) => {});

  constructor() {
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

  // 1) Atualiza `socials` imutavelmente quando trocar o switch
  toggleEnabled(index: number, value: boolean) {
    this.socials.update((list) =>
      list.map((item, i) => (i === index ? { ...item, enabled: value } : item)),
    );
  }

  // 2) Pega o value seguro do FieldState ou do socialsModel (fallback)
  private getFieldValue(key: keyof SocialsFormModel): string {
    const fieldFn = this.socialsForm[key] as unknown as () => any;
    if (typeof fieldFn === 'function') {
      try {
        const state = fieldFn();
        // state.value() é a API que você usa no template
        return typeof state?.value === 'function' ? (state.value() ?? '') : '';
      } catch {
        // em caso de qualquer problema, usa o modelo direto
        return this.socialsModel()[key] ?? '';
      }
    }
    // fallback ao modelo bruto
    return this.socialsModel()[key] ?? '';
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const socialsArray = this.socials();
    const enabledSocials = socialsArray.filter((s) => s.enabled);

    // Valida manualmente só os habilitados
    const invalid = enabledSocials.filter((s) => {
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

    const social_links_filtered = enabledSocials.map((s) => ({
      type: s.key,
      value: this.getFieldValue(s.key as keyof SocialsFormModel),
      enabled: true,
    }));

    const loadingToast = toast.loading('Aguarde, tentando atualizar...', { description: '' });

    this.clientServices.enableSocials(social_links_filtered).subscribe({
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
