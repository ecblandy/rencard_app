import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import {
  PortfolioImage,
  PortfolioVideo,
  ProfileModel,
  Resume,
} from '../../../../../../../shared/types/profile-model';

@Injectable({
  providedIn: 'root',
})
export class ProfileApi {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  createProfile(payload: FormData) {
    return this.http.patch<FormData>(`${this.baseUrl}/profiles/me/`, payload);
  }

  updateProfile(payload: FormData) {
    return this.http.patch<ProfileModel>(`${this.baseUrl}/profiles/me/`, payload);
  }

  updateResume(payload: FormData) {
    return this.http.patch<Resume>(`${this.baseUrl}/profiles/me/resume/`, payload);
  }
  fetchProfile() {
    return this.http.get<ProfileModel>(`${this.baseUrl}/profiles/me/`);
  }

  updateButtons(payload: { type: string; value: string; enabled: boolean }[]) {
    return this.http.post(`${this.baseUrl}/profiles/me/buttons/`, payload);
  }

  updatePortfolioImages(payload: FormData) {
    return this.http.post<PortfolioImage[]>(
      `${this.baseUrl}/profiles/me/portfolio/images/`,
      payload,
    );
  }

  updatePortfolioVideos(youtubeUrl: string) {
    return this.http.post<PortfolioVideo[]>(`${this.baseUrl}/profiles/me/portfolio/videos/`, {
      youtube_url: youtubeUrl,
    });
  }

  updateContact(enabled: boolean) {
    return this.http.patch(`${this.baseUrl}/profiles/me/`, { contact_enabled: enabled });
  }
}
