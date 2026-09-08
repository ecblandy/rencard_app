import { Component, inject, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { toast } from 'ngx-sonner';

import { Surface } from '../../../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../../../components/surface-title/surface-title';
import { SwitchButton } from '../../../../../../../shared/components/switch-button/switch-button';
import { UiButton } from '../../../../../../../shared/ui/button/button';

import { CURRICULUM_CARD } from './curriculum.config';

import { ProfileStore } from '../../services/store/profile.store';
import { ProfileService } from '../../services/facade/profile.service';

@Component({
  selector: 'app-curriculum',
  imports: [Surface, SurfaceTitle, NgIcon, SwitchButton, UiButton],
  templateUrl: './curriculum.html',
  styleUrl: './curriculum.css',
})
export class Curriculum {
  private readonly profileServices = inject(ProfileService);
  private readonly profileStore = inject(ProfileStore);

  curriculum = signal({ ...CURRICULUM_CARD });

  selectedFile = signal<File | null>(null);

  hasExistingFile = signal(false);

  constructor() {
    const resume = this.profileStore.profile().resume;

    if (resume) {
      this.curriculum.set({
        ...CURRICULUM_CARD,
        enabled: resume.enabled,
      });

      this.hasExistingFile.set(!!resume.file);
    }
  }

  toggleEnabled(value: boolean) {
    this.curriculum.update((item) => ({
      ...item,
      enabled: value,
    }));
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Arquivo inválido', {
        description: 'Selecione um arquivo no formato PDF.',
      });

      input.value = '';
      this.selectedFile.set(null);

      return;
    }

    this.selectedFile.set(file);
  }

  onSubmit() {
    const loadingToast = toast.loading('Aguarde, atualizando currículo...', {
      description: '',
    });

    this.profileServices
      .updateResume({
        file: this.selectedFile(),
        enabled: this.curriculum().enabled,
      })
      .subscribe({
        next: () => {
          if (this.selectedFile()) {
            this.hasExistingFile.set(true);
          }

          toast.success('Pronto! Tudo atualizado.', {
            description: 'Currículo atualizado com sucesso!',
            id: loadingToast,
          });
        },

        error: () => {
          toast.error('Ops! Algo deu errado.', {
            description: 'Tente novamente.',
            id: loadingToast,
          });
        },
      });
  }
}
