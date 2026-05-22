import { Component, effect, inject, signal } from '@angular/core';
import { Surface } from '../../../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../../../components/surface-title/surface-title';
import { UiLabel } from '../../../../../../../shared/ui/label/label';
import { NgIcon } from '@ng-icons/core';
import { form, FormField, minLength, required, submit } from '@angular/forms/signals';
import { UiInput } from '../../../../../../../shared/ui/input/input';
import { UiButton } from '../../../../../../../shared/ui/button/button';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from '../../services/facade/profile.service';
import { toast } from 'ngx-sonner';
import { formatErrorList } from '../../../../../../../shared/utils/format-error';
import { ProfileStore } from '../../services/store/profile.store';

interface PersonalModel {
  profile_image: string;
  display_name: string;
  subtitle: string;
}

@Component({
  selector: 'app-personal-info-tab',
  imports: [Surface, SurfaceTitle, UiLabel, NgIcon, FormField, UiInput, UiButton],
  templateUrl: './personal-info-tab.html',
  styleUrl: './personal-info-tab.css',
})
export class PersonalInfoTab {
  profileService = inject(ProfileService);
  profileStore = inject(ProfileStore);

  personalModel = signal<PersonalModel>({
    profile_image: '',
    display_name: '',
    subtitle: '',
  });
  profilePreview = signal<string | null>(null);
  profileFile = signal<File | null>(null);
  imageDirty = signal(false);
  displayNameDirty = signal(false);
  subtitleDirty = signal(false);

  constructor() {
    effect(() => {
      const profile = this.profileStore.profile();

      this.personalModel.set({
        profile_image: profile.profile_image,
        display_name: profile.display_name,
        subtitle: profile.subtitle,
      });

      this.profilePreview.set(profile.profile_image || null);
    });

    effect(() => {
      this.profileStore.updateProfile({
        display_name: this.personalForm.display_name().value(),
        subtitle: this.personalForm.subtitle().value(),
        profile_image: this.profilePreview() || '',
      });
    });
  }

  personalForm = form(this.personalModel, (schema) => {
    required(schema.display_name, { message: 'Campo obrigatório' });
    minLength(schema.display_name, 3, { message: 'Mínimo de 3 caracteres' });

    required(schema.subtitle, { message: 'Campo obrigatório' });
    minLength(schema.subtitle, 3, { message: 'Mínimo de 3 caracteres' });
  });

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.profileFile.set(file);
    this.profilePreview.set(URL.createObjectURL(file));
    this.imageDirty.set(true);
  }

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.personalForm, async () => {
      const values = this.personalForm().value();
      const file = this.profileFile();

      const formData = new FormData();
      formData.append('display_name', values.display_name);
      formData.append('subtitle', values.subtitle);

      if (file) {
        formData.append('profile_image', file);
      }

      const loadingToast = toast.loading('Atualizando dados...');
      try {
        await firstValueFrom(this.profileService.createProfile(formData));
        this.displayNameDirty.set(false);
        this.subtitleDirty.set(false);
        this.imageDirty.set(false);
        toast.success('Sucesso!', {
          description: 'Seus dados foram atualizados com sucesso.',
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
}
