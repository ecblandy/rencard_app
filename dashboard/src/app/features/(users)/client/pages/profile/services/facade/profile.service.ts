// cSpell:ignore youtube

import { Injectable } from '@angular/core';

import { forkJoin, from, map, Observable, of, switchMap, tap } from 'rxjs';

import { ProfileApi } from '../api/profile-api';
import { ProfileStore } from '../store/profile.store';

import {
  Button,
  PortfolioImages,
  PortfolioVideos,
  ProfileModel,
  Resume,
} from '../../../../../../../shared/types/profile-model';

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

  // =========================================================
  // PROFILE
  // =========================================================

  createProfile(payload: FormData): Observable<ProfileModel> {
    return this.profileApi.createProfile(payload).pipe(
      tap((profile: ProfileModel) => {
        console.log('[Profile] CREATE:', profile);

        this.profileStore.setProfileFromAPI(profile);
      }),
    );
  }

  fetchProfile(): Observable<ProfileModel> {
    return this.profileApi.fetchProfile().pipe(
      tap((profile: ProfileModel) => {
        console.log('[Profile] GET:', profile);

        this.profileStore.setProfileFromAPI(profile);
      }),
    );
  }

  updateProfile(payload: FormData): Observable<ProfileModel> {
    return this.profileApi.updateProfile(payload).pipe(
      tap((profile: ProfileModel) => {
        console.log('[Profile] PATCH:', profile);

        this.profileStore.setProfileFromAPI(profile);
      }),
    );
  }

  // =========================================================
  // RESUME
  // =========================================================

  updateResume(payload: { file: File | null; enabled: boolean }): Observable<Resume> {
    const formData = new FormData();

    if (payload.file) {
      formData.append('file', payload.file);
    }

    formData.append('enabled', String(payload.enabled));

    return this.profileApi.updateResume(formData).pipe(
      tap((resume: Resume) => {
        this.profileStore.updateProfile({
          resume,
        });
      }),
    );
  }

  // =========================================================
  // SETTINGS
  // =========================================================

  updateSettings(payload: UpdateSettingsPayload): Observable<ProfileModel> {
    const formData = new FormData();

    formData.append('custom_url', payload.custom_url);

    formData.append('is_private', String(payload.is_private));

    return this.profileApi.updateProfile(formData).pipe(
      tap((profile: ProfileModel) => {
        this.profileStore.setProfileFromAPI(profile);
      }),
    );
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
  ): Observable<Button[]> {
    return this.profileApi.updateButtons(payload).pipe(
      tap((buttons: Button[]) => {
        this.profileStore.setButtons(buttons);
      }),
    );
  }

  // =========================================================
  // PORTFOLIO - IMAGENS
  // =========================================================

  /**
   * Carrega cada URL em um objeto Image() invisível e só
   * resolve quando o navegador termina o download (ou falha).
   * Isso garante que, quando o Store for atualizado com as
   * URLs reais, elas já estejam no cache do navegador —
   * eliminando o "pop"/delay perceptível na troca do preview
   * local (blob) para a imagem definitiva do Cloudinary.
   */
  private preloadImages(urls: string[]): Observable<unknown> {
    if (!urls.length) {
      return of(null);
    }

    return forkJoin(
      urls.map((url) =>
        from(
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve(); // não trava o fluxo em caso de erro
            img.src = url;
          }),
        ),
      ),
    );
  }

  /**
   * Envia os arquivos pendentes (um por requisição, já que a
   * API só aceita um arquivo por upload multipart), sincroniza
   * a visibilidade, busca a lista oficial no backend e
   * pré-carrega as imagens antes de atualizar o Store.
   */
  updatePortfolioImages(enabled: boolean, files: File[]): Observable<PortfolioImages> {
    const uploads$: Observable<unknown> = files.length
      ? forkJoin(files.map((file) => this.profileApi.uploadPortfolioImage(file)))
      : of(null);

    return uploads$.pipe(
      switchMap(() => this.profileApi.setPortfolioImagesEnabled(enabled)),
      switchMap(() => this.profileApi.fetchImages()),
      switchMap((response: PortfolioImages) =>
        this.preloadImages(response.images.map((image) => image.image)).pipe(map(() => response)),
      ),
      tap((response: PortfolioImages) => {
        console.log('[Portfolio Images] Sincronizado com o backend:', response);

        this.profileStore.setPortfolioImagesData(response);
      }),
    );
  }

  deletePortfolioImage(id: number): Observable<PortfolioImages> {
    return this.profileApi.deletePortfolioImage(id).pipe(
      switchMap(() => this.profileApi.fetchImages()),
      tap((response: PortfolioImages) => {
        console.log('[Portfolio Images] Imagem removida, sincronizado:', response);

        this.profileStore.setPortfolioImagesData(response);
      }),
    );
  }

  fetchImages(): Observable<PortfolioImages> {
    return this.profileApi.fetchImages().pipe(
      switchMap((response: PortfolioImages) =>
        this.preloadImages(response.images.map((image) => image.image)).pipe(map(() => response)),
      ),
      tap((response: PortfolioImages) => {
        console.log('[Portfolio Images] GET:', response);

        this.profileStore.setPortfolioImagesData(response);
      }),
    );
  }

  // =========================================================
  // PORTFOLIO - VÍDEOS
  // =========================================================

  updatePortfolioVideos(enabled: boolean, youtubeUrl: string): Observable<PortfolioVideos> {
    return this.profileApi.updatePortfolioVideos(enabled, youtubeUrl).pipe(
      tap((response: PortfolioVideos) => {
        console.log('[Portfolio Videos] POST:', response);

        this.profileStore.setPortfolioVideosData(response);
      }),
    );
  }

  fetchVideos(): Observable<PortfolioVideos> {
    return this.profileApi.fetchVideos().pipe(
      tap((response: PortfolioVideos) => {
        console.log('[Portfolio Videos] GET:', response);

        this.profileStore.setPortfolioVideosData(response);
      }),
    );
  }

  // =========================================================
  // CONTACT
  // =========================================================

  updateContact(enabled: boolean): Observable<ProfileModel> {
    return this.profileApi.updateContact(enabled).pipe(
      tap((profile: ProfileModel) => {
        this.profileStore.setProfileFromAPI(profile);
      }),
    );
  }
}
