import { Component, computed, input } from '@angular/core';
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

  username = computed(() => this.profile()?.custom_url ?? 'viniciusblandy');
  profileUrl = computed(() => this.profile()?.public_url ?? `rencard.app/${this.username()}`);

  copyToClipboard() {
    navigator.clipboard.writeText(this.profileUrl()).then(() => {
      toast.success('Link copiado!');
    });
  }
}
