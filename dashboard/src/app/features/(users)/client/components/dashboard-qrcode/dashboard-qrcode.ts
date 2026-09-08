import { Component, computed, effect, inject, input } from '@angular/core';
import { Surface } from '../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../components/surface-title/surface-title';
import { UiButton } from '../../../../../shared/ui/button/button';
import { toast } from 'ngx-sonner';
import { NgIcon } from '@ng-icons/core';
import { DashboardProfile } from '../../types/dashboard';

@Component({
  selector: 'app-dashboard-qrcode',
  imports: [Surface, SurfaceTitle, UiButton, NgIcon],
  templateUrl: './dashboard-qrcode.html',
  styleUrl: './dashboard-qrcode.css',
})
export class DashboardQrcode {
  profile = input<DashboardProfile | undefined>(undefined);

  username = computed(() => this.profile()?.custom_url ?? 'username');
  profileUrl = computed(() => this.profile()?.public_url ?? `rencard.app/${this.username()}`);
  imageQrCOde = computed(() => this.profile()?.qr_code.image_url ?? '/images/qr-code.svg');

  constructor() {
    effect(() => {
      console.log('profile atualizado:', this.profile());
    });
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.profileUrl()).then(() => {
      toast.success('Link copiado!');
    });
  }

  downloadQrCode() {
    const imageUrl = this.imageQrCOde();
    const username = this.username();

    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qr-code-${username}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('QR Code baixado!');
      })
      .catch(() => {
        toast.error('Erro ao baixar QR Code');
      });
  }
}
