import { ClientService } from './../../services/facade/client.service';
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
  private readonly clientService = inject(ClientService);

  username = computed(() => this.profile()?.custom_url ?? 'username');
  profileUrl = computed(() => this.profile()?.public_url ?? `rencard.app/${this.username()}`);
  imageQrCOde = computed(() => this.profile()?.qr_code?.image_url ?? '/images/qr-code.svg');

  constructor() {
    effect(() => {
      console.log('profile atualizado:', this.profile());
    });

    this.getQrCodeImage();
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.profileUrl()).then(() => {
      toast.success('Link copiado!');
    });
  }

  getQrCodeImage() {
    this.clientService.downloadQrCodeImage().subscribe({
      next: (response) => {
        console.log('QR Code Image Downloaded:', response);
        toast.success('QR Code baixado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao baixar QR Code:', error);
        toast.error('Erro ao baixar QR Code');
      },
    });
  }
}
