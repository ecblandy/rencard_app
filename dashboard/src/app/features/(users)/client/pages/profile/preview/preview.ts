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
  // MUSIC
  // =========================================================

  readonly musicEmbedUrl = signal<SafeResourceUrl>(
    this.sanitizer.bypassSecurityTrustResourceUrl(''),
  );

  // =========================================================
  // YOUTUBE
  // =========================================================

  readonly youtubeEmbedUrls = signal<Record<number, SafeResourceUrl>>({});

  readonly loadedVideoIds = signal<Set<number>>(new Set());

  readonly loadedImageIds = signal<Set<number>>(new Set());

  constructor() {
    // =======================================================
    // YOUTUBE PORTFOLIO
    // =======================================================

    effect(() => {
      const videos = this.profile().portfolio_videos?.videos ?? [];

      const urls: Record<number, SafeResourceUrl> = {};

      for (const video of videos) {
        const videoId = this.getYoutubeVideoId(video.youtube_url);

        if (!videoId) {
          urls[video.id] = this.sanitizer.bypassSecurityTrustResourceUrl('');

          continue;
        }

        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

        urls[video.id] = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      }

      this.youtubeEmbedUrls.set(urls);
    });

    // =======================================================
    // MUSIC: SPOTIFY + YOUTUBE MUSIC
    // =======================================================

    effect(() => {
      const value = this.profile().music?.value ?? '';

      if (!value || this.isSpotifyUserProfile(value)) {
        this.musicEmbedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(''));

        return;
      }

      const embedUrl = this.toSpotifyEmbedUrl(value) ?? this.toYoutubeMusicEmbedUrl(value);

      this.musicEmbedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl ?? ''));
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

      if (hostname === 'music.youtube.com' || hostname === 'youtube.com') {
        return 'YouTube Music';
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

  /**
   * Converte links do Spotify para URLs de embed.
   *
   * Aceita:
   * - track
   * - album
   * - playlist
   * - episode
   * - show
   */
  private toSpotifyEmbedUrl(value: string): string | null {
    try {
      const url = new URL(
        value.trim().startsWith('http') ? value.trim() : `https://${value.trim()}`,
      );

      if (url.hostname.replace(/^www\./, '') !== 'open.spotify.com') {
        return null;
      }

      const match = url.pathname.match(
        /^\/(?:intl-[a-z]{2}(?:-[a-z]{2})?\/)?(track|album|playlist|episode|show)\/([A-Za-z0-9]+)/,
      );

      if (!match) {
        return null;
      }

      return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
    } catch {
      return null;
    }
  }

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
  // YOUTUBE MUSIC
  // =========================================================

  /**
   * Converte links do YouTube Music para URLs de embed.
   *
   * Música:
   * https://music.youtube.com/watch?v=VIDEO_ID
   *
   * Playlist:
   * https://music.youtube.com/playlist?list=PLAYLIST_ID
   */
  private toYoutubeMusicEmbedUrl(value: string): string | null {
    try {
      const url = new URL(
        value.trim().startsWith('http') ? value.trim() : `https://${value.trim()}`,
      );

      const hostname = url.hostname.replace(/^www\./, '');

      if (hostname !== 'music.youtube.com') {
        return null;
      }

      // =====================================================
      // MÚSICA
      // =====================================================

      if (url.pathname === '/watch') {
        const videoId = url.searchParams.get('v');

        if (!videoId) {
          return null;
        }

        return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`;
      }

      // =====================================================
      // PLAYLIST / ÁLBUM
      // =====================================================

      if (url.pathname === '/playlist') {
        const playlistId = url.searchParams.get('list');

        if (!playlistId) {
          return null;
        }

        const embedUrl = new URL('https://www.youtube.com/embed');

        embedUrl.searchParams.set('listType', 'playlist');
        embedUrl.searchParams.set('list', playlistId);

        return embedUrl.toString();
      }

      return null;
    } catch {
      return null;
    }
  }

  isYoutubeMusicLink(url: string): boolean {
    return this.toYoutubeMusicEmbedUrl(url) !== null;
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
  // YOUTUBE PORTFOLIO
  // =========================================================

  private getYoutubeVideoId(url: string): string | null {
    try {
      const parsedUrl = new URL(
        url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`,
      );

      const hostname = parsedUrl.hostname.replace(/^www\./, '');

      // youtube.com/watch?v=...
      if (
        (hostname === 'youtube.com' || hostname === 'm.youtube.com') &&
        parsedUrl.pathname === '/watch'
      ) {
        return parsedUrl.searchParams.get('v');
      }

      // youtube.com/shorts/...
      if (hostname === 'youtube.com' && parsedUrl.pathname.startsWith('/shorts/')) {
        return parsedUrl.pathname.split('/')[2] ?? null;
      }

      // youtube.com/embed/...
      if (hostname === 'youtube.com' && parsedUrl.pathname.startsWith('/embed/')) {
        return parsedUrl.pathname.split('/')[2] ?? null;
      }

      // youtu.be/...
      if (hostname === 'youtu.be') {
        return parsedUrl.pathname.substring(1) || null;
      }

      return null;
    } catch {
      return null;
    }
  }

  getYoutubeThumbnailUrl(url: string): string {
    const videoId = this.getYoutubeVideoId(url);

    if (!videoId) {
      return '';
    }

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

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
