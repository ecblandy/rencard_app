import { Location } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { UiHeader, MenuLink } from '../../shared/ui/header/header';

import { AuthState } from '../../features/auth/services/state/auth/auth-state';
import { SIDEBAR_LINKS } from '../../shared/components/sidebar/sidebar.config';

@Component({
  selector: 'app-dashboard-layout',
  imports: [Sidebar, RouterOutlet, UiHeader],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  private readonly authState = inject(AuthState);
  private readonly location = inject(Location);

  links = computed<MenuLink[]>(() => {
    const user = this.authState.user();

    if (!user) {
      return [];
    }

    const sidebarLinks = SIDEBAR_LINKS[user.role] ?? [];

    return sidebarLinks.map((link) => ({
      label: link.label,
      // O header usa <a href> (requisição real ao servidor), então o href
      // precisa incluir o base href (/app/). prepareExternalUrl faz isso e
      // continua correto se o base href mudar (ex.: ng serve com base "/").
      href: this.location.prepareExternalUrl(link.path),
    }));
  });
}
