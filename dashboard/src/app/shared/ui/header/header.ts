import { Component, input, output, signal } from '@angular/core';

import { NgIcon } from '@ng-icons/core';

export interface MenuLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-header',
  imports: [NgIcon],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class UiHeader {
  links = input<MenuLink[]>([]);
  logout = output<void>();

  isOpen = signal(false);

  toggle() {
    this.isOpen.update((v) => !v);
  }

  onLogout() {
    this.logout.emit();
  }
}
