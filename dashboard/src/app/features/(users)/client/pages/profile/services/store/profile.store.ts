import { effect, Injectable, signal } from '@angular/core';
import {
  Button,
  PortfolioImage,
  PortfolioVideo,
  ProfileModel,
  SocialLink,
} from '../../../../../../../shared/types/profile-model';

const EMPTY_PROFILE: ProfileModel = {
  id: 0,
  owner_name: '',
  background_color: '#FFFFFF',
  font_color: '#000000',
  background_image: '',
  profile_image: '',
  display_name: '',
  subtitle: '',
  custom_url: '',
  is_private: false,
  contact_enabled: false,
  resume: null,
  social_links: [],
  buttons: [],
  portfolio_images: [],
  portfolio_images_enabled: false,
  portfolio_videos: [],
  portfolio_videos_enabled: false,
  music: null,
  button_bg_primary: '',
  button_bg_secondary: '',
  button_text_primary: '',
  button_text_secondary: '',
  text_primary: '',
  text_secondary: '',
  google_analytics_id: '',
  created_at: '',
  updated_at: '',
};

@Injectable({ providedIn: 'root' })
export class ProfileStore {
  readonly profile = signal<ProfileModel>(EMPTY_PROFILE);

  setProfileFromAPI(data: ProfileModel) {
    console.log('Setting profile from API data:', data);
    this.profile.set(data);
  }

  updateProfile(data: Partial<ProfileModel>) {
    this.profile.update((state) => ({ ...state, ...data }));
  }
  updateSocial(id: number, data: Partial<SocialLink>) {
    this.profile.update((state) => ({
      ...state,
      social_links: state.social_links.map((s: SocialLink) =>
        s.id === id ? { ...s, ...data } : s,
      ),
    }));
  }

  setButtons(buttons: Button[]) {
    this.profile.update((state) => ({ ...state, buttons }));
  }

  updateMusic(value: string, enabled: boolean) {
    this.profile.update((state) => ({
      ...state,
      music: { ...(state.music ?? { id: 0, type: 'music' }), value, enabled },
    }));
  }

  setPortfolioImages(images: PortfolioImage[]) {
    this.profile.update((state) => ({ ...state, portfolio_images: images }));
  }

  setPortfolioVideos(videos: PortfolioVideo[]) {
    this.profile.update((state) => ({ ...state, portfolio_videos: videos }));
  }

  setPortfolioImagesEnabled(enabled: boolean) {
    this.profile.update((state) => ({ ...state, portfolio_images_enabled: enabled }));
  }

  setPortfolioVideosEnabled(enabled: boolean) {
    this.profile.update((state) => ({ ...state, portfolio_videos_enabled: enabled }));
  }

  setContactEnabled(enabled: boolean) {
    this.profile.update((state) => ({ ...state, contact_enabled: enabled }));
  }

  constructor() {
    effect(() => {
      console.log('Profile updated:', this.profile());
    });
  }
}
