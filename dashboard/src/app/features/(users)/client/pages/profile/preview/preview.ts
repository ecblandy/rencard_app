import { Component, computed, effect, inject, signal } from '@angular/core';
import { Surface } from '../../../../../../shared/components/surface/surface';
import { ProfileStore } from '../services/store/profile.store';
import { NgIcon } from '@ng-icons/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UiButton } from '../../../../../../shared/ui/button/button';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-preview',
  imports: [Surface, NgIcon, UiButton],
  templateUrl: './preview.html',
  styleUrl: './preview.css',
})
export class Preview {
  private readonly store = inject(ProfileStore);

  readonly profile = this.store.profile;
  private readonly sanitizer = inject(DomSanitizer);

  readonly spotifyEmbedUrl = signal<SafeResourceUrl>(
    this.sanitizer.bypassSecurityTrustResourceUrl(''),
  );

  constructor() {
    effect(() => {
      const value = this.profile().music?.value ?? '';
      if (!value) return;

      const clean = value.replace(/\/intl-[a-z]{2}\//, '/').split('?')[0];

      const embedUrl = clean.replace('open.spotify.com/', 'open.spotify.com/embed/');
      this.spotifyEmbedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl));
    });
  }

  getButtonIcon(type: string): string {
    const icons: Record<string, string> = {
      pix: 'remixPixFill',
      whatsapp: 'bootstrapWhatsapp',
    };
    return icons[type] ?? 'lucideLink';
  }

  getButtonLabel(type: string): string {
    const labels: Record<string, string> = {
      pix: 'Mandar um Pix',
      whatsapp: 'Chamar no WhatsApp',
    };
    return labels[type] ?? type;
  }

  downloadResume() {
    const file = this.profile().resume?.file;
    if (file) {
      window.open(file, '_blank');
    }
  }

  handleButton(button: { type: string; value: string }) {
    if (button.type === 'whatsapp') {
      const phone = button.value.replace(/\D/g, '');
      window.open(`https://wa.me/55${phone}`, '_blank');
      return;
    }

    if (button.type === 'pix') {
      navigator.clipboard.writeText(button.value).then(() => {
        toast.success('Chave Pix copiada!', {
          description: button.value,
        });
      });
      return;
    }
  }
}
