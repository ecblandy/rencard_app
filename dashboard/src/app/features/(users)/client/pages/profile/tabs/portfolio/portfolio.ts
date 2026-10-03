// cSpell:ignore youtube

import { Component, inject, OnDestroy, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { NgIcon } from '@ng-icons/core';
import { toast } from 'ngx-sonner';

import { Surface } from '../../../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../../../components/surface-title/surface-title';
import { SwitchButton } from '../../../../../../../shared/components/switch-button/switch-button';
import { UiButton } from '../../../../../../../shared/ui/button/button';

import { ProfileStore } from '../../services/store/profile.store';
import { ProfileService } from '../../services/facade/profile.service';

import {
  PortfolioImage,
  PortfolioImages,
  PortfolioVideo,
  PortfolioVideos,
} from '../../../../../../../shared/types/profile-model';

// =========================================================
// LIMITES DE UPLOAD
// =========================================================

const MAX_IMAGES = 6;

/** Ajuste para o limite real do seu backend / Cloudinary. */
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface PendingImage {
  file: File;
  preview: string;
  tempId: number;
}

@Component({
  selector: 'app-portfolio',

  imports: [Surface, SurfaceTitle, NgIcon, SwitchButton, UiButton],

  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio implements OnDestroy {
  private readonly profileStore = inject(ProfileStore);

  private readonly profileService = inject(ProfileService);

  // =========================================================
  // STATE
  // =========================================================

  readonly profile = this.profileStore.profile;

  readonly imagesEnabled = signal(false);

  readonly videoEnabled = signal(false);

  readonly youtubeUrl = signal('');

  readonly isSavingImages = signal(false);

  readonly isSavingVideo = signal(false);

  readonly removingImageId = signal<number | null>(null);

  /**
   * IDs das imagens já carregadas pelo navegador, usado
   * apenas para o fade-in suave no grid (evita o "pop"
   * abrupto quando a imagem real termina de baixar).
   */
  readonly loadedImageIds = signal<Set<number>>(new Set());

  /**
   * Arquivos locais que ainda precisam
   * ser enviados ao backend.
   */
  private readonly pendingImages = signal<PendingImage[]>([]);

  // =========================================================
  // INIT
  // =========================================================

  constructor() {
    const profile = this.profile();

    /**
     * Inicializa os switches com o estado
     * atual do ProfileStore.
     */
    this.imagesEnabled.set(profile.portfolio_images?.enabled ?? false);

    this.videoEnabled.set(profile.portfolio_videos?.enabled ?? false);

    /**
     * Se já existe vídeo vindo da API,
     * colocamos a URL no campo.
     */
    const firstVideo = profile.portfolio_videos?.videos?.[0];

    if (firstVideo) {
      this.youtubeUrl.set(firstVideo.youtube_url);
    }
  }

  // =========================================================
  // IMAGENS
  // =========================================================

  /**
   * Separa os arquivos selecionados em válidos e inválidos
   * (tipo não permitido ou tamanho acima do limite).
   */
  private validateFiles(files: File[]): {
    valid: File[];
    invalidType: string[];
    tooLarge: string[];
  } {
    const valid: File[] = [];
    const invalidType: string[] = [];
    const tooLarge: string[] = [];

    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        invalidType.push(file.name);
      } else if (file.size > MAX_IMAGE_SIZE_BYTES) {
        tooLarge.push(file.name);
      } else {
        valid.push(file);
      }
    }

    return { valid, invalidType, tooLarge };
  }

  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const currentImages = this.profile().portfolio_images.images;

    const remaining = MAX_IMAGES - currentImages.length;

    if (remaining <= 0) {
      input.value = '';

      toast.warning('Limite atingido', {
        description: `Você pode adicionar no máximo ${MAX_IMAGES} imagens.`,
      });

      return;
    }

    /**
     * Valida tipo e tamanho ANTES de gerar qualquer preview.
     */
    const { valid, invalidType, tooLarge } = this.validateFiles(Array.from(input.files));

    if (invalidType.length > 0) {
      toast.error('Formato não permitido', {
        description: `Use JPG, PNG ou WebP. Recusado: ${invalidType.join(', ')}`,
      });
    }

    if (tooLarge.length > 0) {
      toast.error('Imagem muito grande', {
        description: `O limite é ${MAX_IMAGE_SIZE_MB} MB por imagem. Recusado: ${tooLarge.join(', ')}`,
      });
    }

    if (valid.length === 0) {
      input.value = '';

      return;
    }

    if (valid.length > remaining) {
      toast.warning('Limite de imagens', {
        description: `Só cabem mais ${remaining}. As demais foram ignoradas.`,
      });
    }

    const files = valid.slice(0, remaining);

    const newPendingImages: PendingImage[] = files.map((file, index) => ({
      file,

      preview: URL.createObjectURL(file),

      tempId: -(Date.now() + index),
    }));

    /**
     * Guarda os arquivos para o POST.
     */
    this.pendingImages.update((current) => [...current, ...newPendingImages]);

    /**
     * IMPORTANTE:
     *
     * Atualizamos o ProfileStore AGORA.
     *
     * É isso que faz o Preview mudar
     * imediatamente sem refresh.
     */
    const previewImages: PortfolioImage[] = newPendingImages.map((image) => ({
      id: image.tempId,
      image: image.preview,
      caption: '',
      created_at: new Date().toISOString(),
    }));

    this.profileStore.setPortfolioImages([...currentImages, ...previewImages]);

    /**
     * Blob local carrega instantaneamente,
     * então já marcamos como "carregada".
     */
    this.loadedImageIds.update((ids) => {
      const next = new Set(ids);
      previewImages.forEach((image) => next.add(image.id));
      return next;
    });

    /**
     * Ao adicionar imagem, habilita
     * automaticamente o portfolio.
     */
    this.imagesEnabled.set(true);

    this.profileStore.setPortfolioImagesEnabled(true);

    input.value = '';
  }

  /**
   * Chamado pelo (load) da tag <img> no template.
   * Usado só para o fade-in suave do grid.
   */
  onImageLoad(id: number) {
    this.loadedImageIds.update((ids) => {
      if (ids.has(id)) return ids;
      const next = new Set(ids);
      next.add(id);
      return next;
    });
  }

  isImageLoaded(id: number): boolean {
    return this.loadedImageIds().has(id);
  }

  // =========================================================
  // REMOVER IMAGEM
  // =========================================================

  removeImage(image: PortfolioImage) {
    /**
     * Imagem temporária (ainda não enviada ao backend).
     *
     * Basta remover localmente, sem chamar a API.
     */
    if (image.id < 0) {
      const pending = this.pendingImages();

      const pendingImage = pending.find((item) => item.tempId === image.id);

      if (pendingImage) {
        URL.revokeObjectURL(pendingImage.preview);

        this.pendingImages.set(pending.filter((item) => item.tempId !== image.id));
      }

      this.profileStore.setPortfolioImages(
        this.profile().portfolio_images.images.filter((item) => item.id !== image.id),
      );

      return;
    }

    /**
     * Imagem já salva no backend.
     *
     * Chama o DELETE real e sincroniza o Store
     * com a resposta oficial ao final.
     */
    this.removingImageId.set(image.id);

    const loadingToast = toast.loading('Removendo imagem...');

    this.profileService.deletePortfolioImage(image.id).subscribe({
      next: (response: PortfolioImages) => {
        console.log('[Portfolio] Imagem removida:', response);

        toast.success('Imagem removida!', {
          id: loadingToast,
        });
      },

      error: (error: HttpErrorResponse) => {
        console.error('[Portfolio] Erro ao remover imagem:', error);

        toast.error('Erro ao remover imagem', {
          description: 'Não foi possível remover a imagem.',
          id: loadingToast,
        });
      },

      complete: () => {
        this.removingImageId.set(null);
      },
    });
  }

  // =========================================================
  // TOGGLE IMAGENS
  // =========================================================

  toggleImages(enabled: boolean) {
    this.imagesEnabled.set(enabled);

    /**
     * Atualização imediata no Store.
     */
    this.profileStore.setPortfolioImagesEnabled(enabled);
  }

  // =========================================================
  // SALVAR IMAGENS
  // =========================================================

  submitImages() {
    const profile = this.profile();

    const images = profile.portfolio_images.images;

    const pending = this.pendingImages();

    /**
     * Se habilitado e não existe imagem:
     */
    if (this.imagesEnabled() && images.length === 0) {
      toast.warning('Nenhuma imagem', {
        description: 'Adicione pelo menos uma imagem antes de salvar.',
      });

      return;
    }

    this.isSavingImages.set(true);

    const loadingToast = toast.loading('Salvando imagens...');

    const filesToUpload: File[] = pending.map((image) => image.file);

    this.profileService.updatePortfolioImages(this.imagesEnabled(), filesToUpload).subscribe({
      next: (response: PortfolioImages) => {
        console.log('[Portfolio] Imagens salvas:', response);

        /**
         * Backend virou fonte oficial.
         *
         * Agora removemos os previews temporários.
         */
        pending.forEach((image) => {
          URL.revokeObjectURL(image.preview);
        });

        this.pendingImages.set([]);

        this.imagesEnabled.set(response.enabled);

        /**
         * As imagens oficiais já foram pré-carregadas
         * pelo Service antes de chegar aqui, então
         * marcamos todas como "carregadas" de uma vez
         * para o grid não re-executar o fade.
         */
        this.loadedImageIds.update((ids) => {
          const next = new Set(ids);
          response.images.forEach((image) => next.add(image.id));
          return next;
        });

        toast.success('Imagens salvas!', {
          description: 'O portfolio foi atualizado.',
          id: loadingToast,
        });
      },

      error: (error: HttpErrorResponse) => {
        console.error('[Portfolio] Erro ao salvar imagens:', error);

        // 413 = o servidor recusou por tamanho (limite do backend/proxy)
        const description =
          error.status === 413
            ? 'Uma das imagens é grande demais para o servidor. Use uma imagem menor.'
            : 'Não foi possível salvar as imagens.';

        toast.error('Erro ao salvar imagens', {
          description,
          id: loadingToast,
        });
      },

      complete: () => {
        this.isSavingImages.set(false);
      },
    });
  }

  // =========================================================
  // VÍDEO
  // =========================================================

  toggleVideo(enabled: boolean) {
    this.videoEnabled.set(enabled);

    /**
     * Atualiza o Store imediatamente.
     */
    this.profileStore.setPortfolioVideosEnabled(enabled);
  }

  // =========================================================
  // INPUT DO VÍDEO
  // =========================================================

  onYoutubeUrlChange(url: string) {
    this.youtubeUrl.set(url);
  }

  // =========================================================
  // SALVAR VÍDEO
  // =========================================================

  submitVideo() {
    const url = this.youtubeUrl().trim();

    if (!url) {
      toast.warning('URL vazia', {
        description: 'Insira o link do YouTube antes de salvar.',
      });

      return;
    }

    /**
     * =====================================================
     * PREVIEW IMEDIATO
     * =====================================================
     *
     * Antes mesmo do backend responder,
     * colocamos o vídeo no ProfileStore.
     */
    const temporaryVideo: PortfolioVideo = {
      id: -Date.now(),
      youtube_url: url,
      created_at: new Date().toISOString(),
    };

    this.profileStore.setPortfolioVideosData({
      enabled: this.videoEnabled(),

      videos: [temporaryVideo],
    });

    this.isSavingVideo.set(true);

    const loadingToast = toast.loading('Salvando vídeo...');

    this.profileService.updatePortfolioVideos(this.videoEnabled(), url).subscribe({
      next: (response: PortfolioVideos) => {
        console.log('[Portfolio] Vídeo salvo:', response);

        /**
         * Service já colocou a resposta
         * oficial no ProfileStore.
         */

        this.youtubeUrl.set(response.videos?.[0]?.youtube_url ?? url);

        toast.success('Vídeo salvo!', {
          description: 'O vídeo foi adicionado ao portfolio.',
          id: loadingToast,
        });
      },

      error: (error: HttpErrorResponse) => {
        console.error('[Portfolio] Erro ao salvar vídeo:', error);

        /**
         * Se o backend falhar,
         * removemos o preview temporário.
         */
        this.profileStore.setPortfolioVideosData({
          enabled: this.videoEnabled(),

          videos: [],
        });

        toast.error('Erro ao salvar vídeo', {
          description: 'Não foi possível salvar o vídeo.',
          id: loadingToast,
        });
      },

      complete: () => {
        this.isSavingVideo.set(false);
      },
    });
  }

  // =========================================================
  // VÍDEO EXISTENTE
  // =========================================================

  hasVideo(): boolean {
    return this.profile().portfolio_videos.videos.length > 0;
  }

  // =========================================================
  // REMOVER VÍDEO
  // =========================================================

  /**
   * Só limpa o vídeo salvo (campo + preview). NÃO desativa
   * o switch "Vídeo" — o usuário pode continuar com a seção
   * habilitada e colar um novo link em seguida.
   *
   * Persiste a remoção no backend reaproveitando o mesmo POST
   * de salvar, enviando uma URL vazia (a API já trata isso
   * como "sem vídeos").
   */
  removeVideo() {
    const wasEnabled = this.videoEnabled();

    const loadingToast = toast.loading('Removendo vídeo...');

    this.profileService.updatePortfolioVideos(wasEnabled, '').subscribe({
      next: (response: PortfolioVideos) => {
        console.log('[Portfolio] Vídeo removido:', response);

        this.youtubeUrl.set('');

        toast.success('Vídeo removido!', {
          id: loadingToast,
        });
      },

      error: (error: HttpErrorResponse) => {
        console.error('[Portfolio] Erro ao remover vídeo:', error);

        toast.error('Erro ao remover vídeo', {
          description: 'Não foi possível remover o vídeo.',
          id: loadingToast,
        });
      },
    });
  }

  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy() {
    /**
     * Libera os Blob URLs.
     */
    this.pendingImages().forEach((image) => {
      URL.revokeObjectURL(image.preview);
    });
  }
}
