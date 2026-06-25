import { Component, computed, inject, signal } from '@angular/core';
import { ProfileService } from './services/facade/profile.service';
import { ProfileStore } from './services/store/profile.store';
import { NgComponentOutlet } from '@angular/common';
import { EDITOR_TABS } from './editor-tabs.config';
import { NgIcon } from '@ng-icons/core';
import { Preview } from './preview/preview';
import { DashboardTitle } from '../../../components/dashboard-title/dashboard-title';
import { AuthState } from '../../../../auth/services/state/auth/auth-state';

@Component({
  selector: 'app-profile',
  imports: [NgComponentOutlet, NgIcon, Preview, DashboardTitle],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly profileService = inject(ProfileService);
  private readonly profileStore = inject(ProfileStore);
  private readonly authState = inject(AuthState);

  readonly tabs = signal(EDITOR_TABS);
  readonly isPro = computed(
    () => this.authState.user()?.active_access_grant?.permissions?.can_use_pro_features ?? false,
  );

  activeTabKey = signal(this.tabs()[0].key);

  activeTabComponent = computed(
    () => this.tabs().find((tab) => tab.key === this.activeTabKey())?.component ?? null,
  );

  isLoaded = signal(false);

  selectTab(key: string) {
    const tab = this.tabs().find((t) => t.key === key);
    if (tab?.requiresPro && !this.isPro()) return; // bloqueia navegação
    this.activeTabKey.set(key);
  }

  ngOnInit() {
    this.profileService.fetchProfile().subscribe({
      next: (profile) => {
        this.profileStore.setProfileFromAPI(profile);
        this.isLoaded.set(true);
      },
    });
  }
}
