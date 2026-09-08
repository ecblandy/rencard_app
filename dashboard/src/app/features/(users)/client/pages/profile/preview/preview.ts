import { Component, effect, inject, signal } from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { NgIcon } from '@ng-icons/core';
import { toast } from 'ngx-sonner';

import { Surface } from '../../../../../../shared/components/surface/surface';
import { UiButton } from '../../../../../../shared/ui/button/button';

import { ProfileStore } from '../services/store/profile.store';
import { AppearanceStore } from '../tabs/appearance/appearence-store';

interface SocialLink {
  enabled: boolean;
  value: string;
  icon?: string;
  type?: string;
}

@Component({
  selector: 'app-preview',

  imports: [Surface, NgIcon, UiButton],

  templateUrl: './preview.html',
  styleUrl: './preview.css',
})
export class Preview {
  private readonly store = inject(ProfileStore);

  readonly appearance = inject(AppearanceStore);

  private readonly sanitizer = inject(DomSanitizer);

  readonly profile = this.store.profile;

  // =========================================================
  // SPOTIFY
  // =========================================================

  readonly spotifyEmbedUrl = signal<SafeResourceUrl>(
    this.sanitizer.bypassSecurityTrustResourceUrl(''),
  );

  // =========================================================
  // YOUTUBE
  // =========================================================

  /**
   * Guarda as URLs sanitizadas dos vídeos.
   *
   * IMPORTANTE:
   * Não criamos SafeResourceUrl diretamente no template.
   *
   * Isso evita que o Angular receba uma nova referência
   * de URL a cada change detection e recrie o iframe.
   *
   * Estrutura:
   *
   * {
   *   1: SafeResourceUrl,
   *   2: SafeResourceUrl,
   * }
   */
  readonly youtubeEmbedUrls = signal<Record<number, SafeResourceUrl>>({});

  /**
   * IDs dos vídeos que já terminaram de carregar.
   *
   * Usado somente para controlar o fade-in do iframe.
   */
  readonly loadedVideoIds = signal<Set<number>>(new Set());

  /**
   * IDs das imagens que já terminaram de carregar.
   */
  readonly loadedImageIds = signal<Set<number>>(new Set());

  constructor() {
    // =======================================================
    // YOUTUBE
    // =======================================================

    effect(() => {
      const videos = this.profile().portfolio_videos?.videos ?? [];

      const urls: Record<number, SafeResourceUrl> = {};

      for (const video of videos) {
        const videoId = this.getYoutubeVideoId(video.youtube_url);

        /**
         * Se a URL não for válida, não criamos um iframe
         * apontando para uma URL inválida.
         */
        if (!videoId) {
          urls[video.id] = this.sanitizer.bypassSecurityTrustResourceUrl('');

          continue;
        }

        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

        urls[video.id] = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      }

      /**
       * Atualiza todas as URLs de uma vez.
       *
       * Esse signal só muda quando o profile muda.
       */
      this.youtubeEmbedUrls.set(urls);
    });

    // =======================================================
    // SPOTIFY
    // =======================================================

    effect(() => {
      const value = this.profile().music?.value ?? '';

      if (!value || this.isSpotifyUserProfile(value)) {
        this.spotifyEmbedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(''));

        return;
      }

      const clean = value.replace(/\/intl-[a-z]{2}\//, '/').split('?')[0];

      const embedUrl = clean.replace('open.spotify.com/', 'open.spotify.com/embed/');

      this.spotifyEmbedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl));
    });
  }

  // =========================================================
  // SOCIAL
  // =========================================================

  private isEmailSocial(social: SocialLink): boolean {
    if (social.type === 'email') {
      return true;
    }

    if (social.value?.includes('mailto:')) {
      return true;
    }

    try {
      new URL(social.value);

      return false;
    } catch {
      return social.value?.includes('@') ?? false;
    }
  }

  getFilteredSocials(): SocialLink[] {
    return this.profile().social_links.filter((social) => !this.isEmailSocial(social));
  }

  getEmailSocial():
    | (SocialLink & {
        icon: string;
      })
    | undefined {
    const emailSocial = this.profile().social_links.find((social) => this.isEmailSocial(social));

    if (!emailSocial) {
      return undefined;
    }

    return {
      ...emailSocial,
      icon: emailSocial.icon || 'lucideMailOpen',
    };
  }

  // =========================================================
  // BUTTONS
  // =========================================================

  getButtonIcon(type: string): string {
    const icons: Record<string, string> = {
      pix: 'remixPixFill',
      whatsapp: 'bootstrapWhatsapp',
    };

    return icons[type] ?? 'lucideLink';
  }

  getButtonLabel(type: string): string {
    const labels: Record<string, string> = {
      pix: 'Copiar Chave Pix',
      whatsapp: 'Chamar no WhatsApp',
    };

    return labels[type] ?? type;
  }

  // =========================================================
  // RESUME
  // =========================================================

  downloadResume(): void {
    const file = this.profile().resume?.file;

    if (file) {
      window.open(file, '_blank');
    }
  }

  // =========================================================
  // BUTTON ACTION
  // =========================================================

  handleButton(button: { type: string; value: string }): void {
    if (button.type === 'whatsapp') {
      const phone = button.value.replace(/\D/g, '');

      window.open(`https://wa.me/55${phone}`, '_blank');

      return;
    }

    if (button.type === 'pix') {
      navigator.clipboard
        .writeText(button.value)
        .then(() => {
          toast.success('Chave Pix copiada!', {
            description: button.value,
          });
        })
        .catch(() => {
          toast.error('Não foi possível copiar a chave Pix.');
        });

      return;
    }
  }

  // =========================================================
  // SOCIAL USERNAME
  // =========================================================

  getSocialUsername(url: string): string {
    try {
      const parsedUrl = new URL(
        url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`,
      );

      const hostname = parsedUrl.hostname.replace(/^www\./, '');

      const pathname = parsedUrl.pathname.split('/').filter(Boolean);

      if (hostname === 'open.spotify.com') {
        return 'Spotify';
      }

      const socialDomains = [
        'instagram.com',
        'github.com',
        'linkedin.com',
        'twitter.com',
        'x.com',
        'facebook.com',
        'tiktok.com',
        'youtube.com',
      ];

      const isSocial = socialDomains.some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
      );

      if (!isSocial) {
        return hostname;
      }

      return pathname.pop()?.replace(/^@/, '') || hostname;
    } catch {
      return url
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '');
    }
  }

  // =========================================================
  // SPOTIFY
  // =========================================================

  isSpotifyUserProfile(url: string): boolean {
    try {
      const parsedUrl = new URL(
        url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`,
      );

      const hostname = parsedUrl.hostname.replace(/^www\./, '');

      const pathname = parsedUrl.pathname.split('/').filter(Boolean);

      return hostname === 'open.spotify.com' && pathname[0] === 'user';
    } catch {
      return false;
    }
  }

  openSpotify(): void {
    const value = this.profile().music?.value;

    if (!value) {
      return;
    }

    window.open(value, '_blank');
  }

  getSpotifyLabel(): string {
    const value = this.profile().music?.value;

    if (!value) {
      return 'Spotify';
    }

    return this.isSpotifyUserProfile(value) ? 'Minha conta' : 'Spotify';
  }

  // =========================================================
  // SOCIAL
  // =========================================================

  openSocial(url: string): void {
    window.open(url, '_blank');
  }

  openEmailSocial(email: string): void {
    const cleanEmail = email.replace('mailto:', '');

    window.location.href = `mailto:${cleanEmail}`;
  }

  // =========================================================
  // IMAGENS
  // =========================================================

  onImageLoad(id: number): void {
    this.loadedImageIds.update((ids) => {
      if (ids.has(id)) {
        return ids;
      }

      const next = new Set(ids);

      next.add(id);

      return next;
    });
  }

  isImageLoaded(id: number): boolean {
    return this.loadedImageIds().has(id);
  }

  // =========================================================
  // YOUTUBE
  // =========================================================

  /**
   * Retorna o ID do vídeo do YouTube.
   *
   * Aceita:
   *
   * https://www.youtube.com/watch?v=ABC
   * https://www.youtube.com/shorts/ABC
   * https://www.youtube.com/embed/ABC
   * https://youtu.be/ABC
   */
  private getYoutubeVideoId(url: string): string | null {
    try {
      const parsedUrl = new URL(
        url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`,
      );

      const hostname = parsedUrl.hostname.replace(/^www\./, '');

      // =====================================================
      // youtube.com/watch?v=...
      // =====================================================

      if (hostname === 'youtube.com' && parsedUrl.pathname === '/watch') {
        return parsedUrl.searchParams.get('v');
      }

      // =====================================================
      // youtube.com/shorts/...
      // =====================================================

      if (hostname === 'youtube.com' && parsedUrl.pathname.startsWith('/shorts/')) {
        return parsedUrl.pathname.split('/')[2] ?? null;
      }

      // =====================================================
      // youtube.com/embed/...
      // =====================================================

      if (hostname === 'youtube.com' && parsedUrl.pathname.startsWith('/embed/')) {
        return parsedUrl.pathname.split('/')[2] ?? null;
      }

      // =====================================================
      // youtu.be/...
      // =====================================================

      if (hostname === 'youtu.be') {
        return parsedUrl.pathname.substring(1) || null;
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Retorna a thumbnail do YouTube.
   *
   * Essa imagem fica atrás do iframe enquanto o
   * player ainda está carregando.
   */
  getYoutubeThumbnailUrl(url: string): string {
    const videoId = this.getYoutubeVideoId(url);

    if (!videoId) {
      return '';
    }

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  /**
   * Chamado somente quando o iframe realmente terminou
   * de carregar.
   */
  onVideoLoad(id: number): void {
    this.loadedVideoIds.update((ids) => {
      if (ids.has(id)) {
        return ids;
      }

      const next = new Set(ids);

      next.add(id);

      return next;
    });
  }

  isVideoLoaded(id: number): boolean {
    return this.loadedVideoIds().has(id);
  }

  // =========================================================
  // PUBLIC PROFILE
  // =========================================================

  goToRecardPublickProfile(): void {
    const userUrl = this.profile().custom_url;

    if (!userUrl) {
      return;
    }

    window.open(`https://rencard.com.br/${userUrl}`, '_blank');
  }
}
