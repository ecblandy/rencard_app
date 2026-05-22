import { Component, inject, signal } from '@angular/core';
import { Surface } from '../../../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../../../components/surface-title/surface-title';
import { NgIcon } from '@ng-icons/core';
import { SwitchButton } from '../../../../../../../shared/components/switch-button/switch-button';
import { UiButton } from '../../../../../../../shared/ui/button/button';
import { ProfileStore } from '../../services/store/profile.store';
import { ProfileService } from '../../services/facade/profile.service';
import { toast } from 'ngx-sonner';

interface SelectedImage {
  file: File;
  preview: string;
}

@Component({
  selector: 'app-portfolio',
  imports: [Surface, SurfaceTitle, NgIcon, SwitchButton, UiButton],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio {
  private readonly profileService = inject(ProfileService);
  private readonly profileStore = inject(ProfileStore);

  imagesEnabled = signal(false);
  videoEnabled = signal(false);

  selectedImages = signal<SelectedImage[]>([]);
  youtubeUrl = signal('');

  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const remaining = 6 - this.selectedImages().length;
    const files = Array.from(input.files).slice(0, remaining);

    const newImages: SelectedImage[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    this.selectedImages.update((current) => [...current, ...newImages]);
    input.value = '';
  }

  removeImage(index: number) {
    this.selectedImages.update((current) => {
      URL.revokeObjectURL(current[index].preview);
      return current.filter((_, i) => i !== index);
    });
  }

  submitImages() {
    if (this.selectedImages().length === 0) {
      toast.warning('Nenhuma imagem selecionada', {
        description: 'Adicione ao menos uma imagem antes de salvar.',
      });
      return;
    }

    const formData = new FormData();
    this.selectedImages().forEach((img) => formData.append('image', img.file));

    const loadingToast = toast.loading('Salvando imagens...', { description: '' });

    this.profileService.updatePortfolioImages(formData).subscribe({
      next: () => {
        toast.success('Imagens salvas!', {
          description: 'As imagens do portfolio foram atualizadas.',
          id: loadingToast,
        });
      },
      error: (error) => {
        console.error('Erro ao salvar imagens:', error);
        toast.error('Ops! Algo deu errado.', {
          description: 'Não foi possível salvar as imagens. Tente novamente.',
          id: loadingToast,
        });
      },
    });
  }

  submitVideo() {
    if (!this.youtubeUrl().trim()) {
      toast.warning('URL vazia', {
        description: 'Insira o link do YouTube antes de salvar.',
      });
      return;
    }

    const loadingToast = toast.loading('Salvando vídeo...', { description: '' });

    this.profileService.updatePortfolioVideos(this.youtubeUrl().trim()).subscribe({
      next: () => {
        toast.success('Vídeo salvo!', {
          description: 'O vídeo do portfolio foi atualizado.',
          id: loadingToast,
        });
      },
      error: (error) => {
        console.error('Erro ao salvar vídeo:', error);
        toast.error('Ops! Algo deu errado.', {
          description: 'Não foi possível salvar o vídeo. Tente novamente.',
          id: loadingToast,
        });
      },
    });
  }

  constructor() {
    const profile = this.profileStore.profile();
    this.imagesEnabled.set(profile.portfolio_images_enabled);
    this.videoEnabled.set(profile.portfolio_videos_enabled);
  }

  toggleImages(value: boolean) {
    this.imagesEnabled.set(value);
    this.profileStore.setPortfolioImagesEnabled(value);
  }

  toggleVideo(value: boolean) {
    this.videoEnabled.set(value);
    this.profileStore.setPortfolioVideosEnabled(value);
  }
}
