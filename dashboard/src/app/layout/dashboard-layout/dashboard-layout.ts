import { Location } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';

import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { UiHeader, MenuLink } from '../../shared/ui/header/header';

import { AuthState } from '../../features/auth/services/state/auth/auth-state';
import { Auth } from '../../features/auth/services/facade/auth';
import { SIDEBAR_LINKS } from '../../shared/components/sidebar/sidebar.config';

@Component({
  selector: 'app-dashboard-layout',
  imports: [Sidebar, RouterOutlet, UiHeader],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  private readonly authState = inject(AuthState);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  links = computed<MenuLink[]>(() => {
    const user = this.authState.user();

    if (!user) {
      return [];
    }

    const sidebarLinks = SIDEBAR_LINKS[user.role] ?? [];

    return sidebarLinks.map((link) => ({
      label: link.label,
      href: this.location.prepareExternalUrl(link.path),
    }));
  });

  async onLogout() {
    const loadingToast = toast.loading('Saindo...', {
      description: 'Você está sendo desconectado.',
    });

    try {
      await firstValueFrom(this.auth.logout());

      toast.success('Até logo!', {
        description: 'Sessão encerrada com sucesso.',
        id: loadingToast,
      });

      this.router.navigate(['/auth/signin']);
    } catch (error) {
      console.error('[DashboardLayout] erro no logout:', error);

      toast.error('Erro ao sair', {
        description: 'Não foi possível fazer logout.',
        id: loadingToast,
      });

      this.authState.clear();
      this.router.navigate(['/auth/signin']);
    }
  }
}
