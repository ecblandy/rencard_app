import { Component, computed, inject, signal } from '@angular/core';
import { ProfileService } from './services/facade/profile.service';
import { ProfileStore } from './services/store/profile.store';
import { NgComponentOutlet } from '@angular/common';
import { EDITOR_TABS } from './editor-tabs.config';
import { NgIcon } from '@ng-icons/core';
import { Preview } from './preview/preview';
import { DashboardTitle } from '../../../components/dashboard-title/dashboard-title';

@Component({
  selector: 'app-profile',
  imports: [NgComponentOutlet, NgIcon, Preview, DashboardTitle],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly profileService = inject(ProfileService);
  private readonly profileStore = inject(ProfileStore);

  readonly tabs = signal(EDITOR_TABS);

  activeTabKey = signal(this.tabs()[0].key);

  activeTabComponent = computed(
    () => this.tabs().find((tab) => tab.key === this.activeTabKey())?.component ?? null,
  );

  activeTabInputs = computed(() => ({
    profile: this.profileStore.profile(), // passa o signal do store
  }));

  selectTab(key: string) {
    this.activeTabKey.set(key);
  }

  isLoaded = signal(false);

  ngOnInit() {
    this.profileService.fetchProfile().subscribe({
      next: (profile) => {
        this.profileStore.setProfileFromAPI(profile);
        this.isLoaded.set(true); // só renderiza após API responder
      },
    });
  }

  constructor() {
    console.log('Profile store instance:', this.profileStore);
  }
}
