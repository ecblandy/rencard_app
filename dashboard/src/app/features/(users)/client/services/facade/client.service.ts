import { inject, Injectable } from '@angular/core';
import { ClientApi } from '../api/client-api';
import { tap } from 'rxjs';
import { ProfileModel, SocialLink } from '../../../../../shared/types/profile-model';
import { ProfileStore } from '../../pages/profile/services/store/profile.store';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly api = inject(ClientApi);
  private readonly profileStore = inject(ProfileStore);

  getClientPlan() {
    return this.api.clientPlan().pipe(
      tap((response) => {
        console.log('Client Plan Response:', response);
      }),
    );
  }

  enableSocials(socials: SocialLink[]) {
    return this.api.enableSocials(socials).pipe(
      tap((response) => {
        console.log('Enable Socials Response:', response);
      }),
    );
  }

  fetchDashboardDetails(period: 'today' | '7d' | '30d') {
    return this.api.dashboardDetails(period).pipe(
      tap((response) => {
        console.log('Dashboard Details Response:', response);
      }),
    );
  }

  updateProfileField(field: string, value: string) {
    return this.api.updateProfileField(field, value).pipe(
      tap((response) => {
        this.profileStore.setProfileFromAPI(response as ProfileModel);
      }),
    );
  }

  updateMusic(payload: { value: string; enabled: boolean }) {
    return this.api.updateMusic(payload).pipe(
      tap((response) => {
        this.profileStore.setProfileFromAPI(response as ProfileModel);
      }),
    );
  }

  updateResume(payload: { file: File | null; enabled: boolean }) {
    return this.api.updateResume(payload).pipe(
      tap((response) => {
        this.profileStore.setProfileFromAPI(response as ProfileModel);
      }),
    );
  }
}
