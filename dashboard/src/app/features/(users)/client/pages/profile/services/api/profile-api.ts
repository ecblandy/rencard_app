import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../../../../../environments/environments';

import {
  Button,
  PortfolioImage,
  PortfolioImages,
  PortfolioVideos,
  ProfileModel,
  Resume,
} from '../../../../../../../shared/types/profile-model';

import { AppearanceSettings } from '../../tabs/appearance/appearence-store';

@Injectable({
  providedIn: 'root',
})
export class ProfileApi {
  private readonly baseUrl = environment.apiUrl;

  private readonly http = inject(HttpClient);

  // =========================================================
  // PROFILE
  // =========================================================

  createProfile(payload: FormData) {
    return this.http.patch<ProfileModel>(`${this.baseUrl}/profiles/me/`, payload);
  }

  updateProfile(payload: FormData) {
    return this.http.patch<ProfileModel>(`${this.baseUrl}/profiles/me/`, payload);
  }

  fetchProfile() {
    return this.http.get<ProfileModel>(`${this.baseUrl}/profiles/me/`);
  }

  // =========================================================
  // RESUME
  // =========================================================

  updateResume(payload: FormData) {
    return this.http.patch<Resume>(`${this.baseUrl}/profiles/me/resume/`, payload);
  }

  // =========================================================
  // BUTTONS
  // =========================================================

  updateButtons(
    payload: {
      type: string;
      value: string;
      enabled: boolean;
    }[],
  ) {
    return this.http.post<Button[]>(`${this.baseUrl}/profiles/me/buttons/`, payload);
  }

  // =========================================================
  // APPEARANCE
  // =========================================================

  updateAppearance(payload: AppearanceSettings) {
    return this.http.patch<ProfileModel>(`${this.baseUrl}/profiles/me/`, payload);
  }

  // =========================================================
  // PORTFOLIO - IMAGENS
  // =========================================================

  /**
   * Envia UMA imagem nova via multipart/form-data.
   *
   * A API aceita apenas um arquivo por requisição.
   */
  uploadPortfolioImage(file: File, caption?: string) {
    const formData = new FormData();

    formData.append('image', file);

    if (caption) {
      formData.append('caption', caption);
    }

    return this.http.post<PortfolioImage>(
      `${this.baseUrl}/profiles/me/portfolio/images/`,
      formData,
    );
  }

  /**
   * Altera apenas a visibilidade do portfolio de imagens.
   */
  setPortfolioImagesEnabled(enabled: boolean) {
    return this.http.post<PortfolioImages>(`${this.baseUrl}/profiles/me/portfolio/images/`, {
      enabled,
    });
  }

  /**
   * Remove uma imagem específica do portfolio.
   */
  deletePortfolioImage(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/profiles/me/portfolio/images/${id}/`);
  }

  /**
   * Busca as imagens do portfolio.
   */
  fetchImages() {
    return this.http.get<PortfolioImages>(`${this.baseUrl}/profiles/me/portfolio/images/`);
  }

  // =========================================================
  // PORTFOLIO - VÍDEOS
  // =========================================================

  updatePortfolioVideos(enabled: boolean, youtubeUrl?: string) {
    const videos = youtubeUrl?.trim()
      ? [
          {
            youtube_url: youtubeUrl.trim(),
          },
        ]
      : [];

    return this.http.post<PortfolioVideos>(`${this.baseUrl}/profiles/me/portfolio/videos/`, {
      enabled,
      videos,
    });
  }

  fetchVideos() {
    return this.http.get<PortfolioVideos>(`${this.baseUrl}/profiles/me/portfolio/videos/`);
  }

  // =========================================================
  // CONTACT
  // =========================================================

  updateContact(enabled: boolean) {
    return this.http.patch<ProfileModel>(`${this.baseUrl}/profiles/me/`, {
      contact_enabled: enabled,
    });
  }
}
