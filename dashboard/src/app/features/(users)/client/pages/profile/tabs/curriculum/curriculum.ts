import { Component, inject, signal } from '@angular/core';
import { Surface } from '../../../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../../../components/surface-title/surface-title';
import { NgIcon } from '@ng-icons/core';
import { SwitchButton } from '../../../../../../../shared/components/switch-button/switch-button';
import { CURRICULUM_CARD, CurriculumFormModel } from './curriculum.config';
import { UiInput } from '../../../../../../../shared/ui/input/input';
import { UiButton } from '../../../../../../../shared/ui/button/button';
import { toast } from 'ngx-sonner';
import { ClientService } from '../../../../services/facade/client.service';
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

  constructor() {
    const storeResume = this.profileStore.profile().resume;
    if (storeResume) {
      this.curriculum.set({ ...CURRICULUM_CARD, enabled: storeResume.enabled });
    }
  }

  toggleEnabled(value: boolean) {
    this.curriculum.update((item) => ({ ...item, enabled: value }));
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log('Selected file:', input.files?.[0]);
    const file = input.files?.[0] ?? null;
    this.selectedFile.set(file);
  }

  onSubmit() {
    const loadingToast = toast.loading('Aguarde, atualizando currículo...', { description: '' });

    this.profileServices
      .updateResume({ file: this.selectedFile(), enabled: this.curriculum().enabled })
      .subscribe({
        next: () => {
          toast.success('Pronto! Tudo atualizado.', {
            description: 'Currículo atualizado com sucesso!',
            id: loadingToast,
          });
        },
        error: () =>
          toast.error('Ops! Algo deu errado.', {
            description: 'Tente novamente.',
            id: loadingToast,
          }),
      });
  }
}
