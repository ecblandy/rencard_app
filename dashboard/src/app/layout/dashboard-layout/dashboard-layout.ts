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

  links = computed<MenuLink[]>(() => {
    const user = this.authState.user();

    if (!user) {
      return [];
    }

    const sidebarLinks = SIDEBAR_LINKS[user.role] ?? [];

    return sidebarLinks.map((link) => ({
      label: link.label,
      href: link.path,
    }));
  });
}
