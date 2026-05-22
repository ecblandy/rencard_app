import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProfileModel, SocialLink } from '../../../../../shared/types/profile-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientApi {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  clientPlan() {
    return this.http.get(`${this.baseUrl}/payments/subscriptions/`);
  }

  enableSocials(socials: SocialLink[]) {
    return this.http.post(`${this.baseUrl}/profiles/me/socials/`, { socials });
  }

  dashboardDetails(period: 'today' | '7d' | '30d') {
    const params = new HttpParams().set('period', period);
    return this.http.get(`${this.baseUrl}/users/client/dashboard/`, { params });
  }

  updateProfileField(field: string, value: string): Observable<ProfileModel> {
    return this.http.patch<ProfileModel>(`${this.baseUrl}/profiles/me/`, { [field]: value });
  }

  updateMusic(payload: { value: string; enabled: boolean }): Observable<ProfileModel> {
    return this.http.patch<ProfileModel>(`${this.baseUrl}/profiles/me/music/`, {
      value: payload.value,
      enabled: payload.enabled,
    });
  }

  updateResume(payload: { file: File | null; enabled: boolean }): Observable<ProfileModel> {
    const formData = new FormData();
    formData.append('resume_enabled', String(payload.enabled));

    if (payload.file) {
      formData.append('resume_file', payload.file, payload.file.name);
    }

    return this.http.patch<ProfileModel>(`${this.baseUrl}/profiles/me/`, formData);
  }
}
