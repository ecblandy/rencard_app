import { Injectable } from '@angular/core';
import { ProfileApi } from '../api/profile-api';
import { tap } from 'rxjs';
import { ProfileStore } from '../store/profile.store';

interface UpdateSettingsPayload {
  custom_url: string;
  is_private: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private readonly profileApi: ProfileApi,
    private readonly profileStore: ProfileStore,
  ) {}

  createProfile(payload: FormData) {
    return this.profileApi.createProfile(payload).pipe(
      tap((user) => {
        console.log('[Profile] perfil criado com sucesso:', user);
      }),
    );
  }

  updateResume(payload: { file: File | null; enabled: boolean }) {
    const formData = new FormData();

    if (payload.file) {
      formData.append('file', payload.file);
    }

    formData.append('enabled', String(payload.enabled));

    return this.profileApi
      .updateResume(formData)
      .pipe(tap((resume) => this.profileStore.updateProfile({ resume })));
  }

  updateSettings(payload: UpdateSettingsPayload) {
    const formData = new FormData();
    formData.append('custom_url', payload.custom_url);
    formData.append('is_private', String(payload.is_private));

    return this.profileApi
      .updateProfile(formData)
      .pipe(tap((profile) => this.profileStore.setProfileFromAPI(profile)));
  }

  fetchProfile() {
    return this.profileApi.fetchProfile();
  }

  updateButtons(payload: { type: string; value: string; enabled: boolean }[]) {
    return this.profileApi.updateButtons(payload);
  }

  updatePortfolioImages(payload: FormData) {
    return this.profileApi
      .updatePortfolioImages(payload)
      .pipe(tap((images) => this.profileStore.setPortfolioImages(images)));
  }

  updatePortfolioVideos(youtubeUrl: string) {
    return this.profileApi
      .updatePortfolioVideos(youtubeUrl)
      .pipe(tap((videos) => this.profileStore.setPortfolioVideos(videos)));
  }

  updateContact(enabled: boolean) {
    return this.profileApi
      .updateContact(enabled)
      .pipe(tap(() => this.profileStore.setContactEnabled(enabled)));
  }
}
