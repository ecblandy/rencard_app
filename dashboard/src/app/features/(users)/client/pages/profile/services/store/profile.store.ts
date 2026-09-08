import { effect, inject, Injectable, signal } from '@angular/core';

import {
  Button,
  PortfolioImage,
  PortfolioVideo,
  ProfileModel,
  SocialLink,
} from '../../../../../../../shared/types/profile-model';

import { AppearanceStore } from '../../tabs/appearance/appearence-store';

const EMPTY_PROFILE: ProfileModel = {
  // =========================================================
  // USER
  // =========================================================

  id: 0,
  role: '',
  full_name: '',
  username: '',
  email: '',
  phone_number: '',
  cpf_cnpj: '',

  // =========================================================
  // ADDRESS
  // =========================================================

  street: '',
  number: '',
  neighborhood: '',
  cep: '',
  complement: '',
  city: '',
  state: '',
  country: '',

  // =========================================================
  // PROFILE
  // =========================================================

  owner_name: '',

  google_analytics_id: '',

  background_color: '',
  text_primary: '',
  text_secondary: '',

  button_bg_primary: '',
  button_bg_secondary: '',

  button_text_primary: '',
  button_text_secondary: '',

  background_image: null,
  profile_image: null,

  qr_image: '',

  display_name: '',
  subtitle: '',
  custom_url: '',

  is_private: false,
  contact_enabled: false,

  resume: null,

  social_links: [],
  buttons: [],

  portfolio_images: {
    enabled: false,
    images: [],
  },

  portfolio_videos: {
    enabled: false,
    videos: [],
  },

  music: null,

  // =========================================================
  // ACCOUNT
  // =========================================================

  email_confirmed: false,

  last_payment_date: null,
  next_charge_date: null,

  terms_accepted: false,
  is_active: false,

  // =========================================================
  // PHYSICAL ITEMS
  // =========================================================

  physical_items: [],

  // =========================================================
  // PLANS
  // =========================================================

  active_plan: null,

  active_access_grant: null,

  pending_plan: null,

  // =========================================================
  // TIMESTAMPS
  // =========================================================

  created_at: '',
  updated_at: '',
};

@Injectable({
  providedIn: 'root',
})
export class ProfileStore {
  readonly profile = signal<ProfileModel>(EMPTY_PROFILE);

  private readonly appearanceStore = inject(AppearanceStore);

  constructor() {
    effect(() => {
      console.log('[ProfileStore] STATE:', this.profile());
    });
  }

  // =========================================================
  // PROFILE
  // =========================================================
  setProfileFromAPI(data: Partial<ProfileModel>) {
    console.log('[ProfileStore] API DATA:', data);

    this.profile.update((current) => {
      const updatedProfile: ProfileModel = {
        ...current,
        ...data,

        social_links: data.social_links ?? current.social_links ?? [],

        buttons: data.buttons ?? current.buttons ?? [],

        portfolio_images: data.portfolio_images ?? current.portfolio_images,

        portfolio_videos: data.portfolio_videos ?? current.portfolio_videos,

        physical_items: data.physical_items ?? current.physical_items ?? [],

        active_plan: data.active_plan ?? current.active_plan,

        active_access_grant: data.active_access_grant ?? current.active_access_grant,

        pending_plan: data.pending_plan ?? current.pending_plan,

        music: data.music ?? current.music,

        resume: data.resume ?? current.resume,
      };

      return updatedProfile;
    });

    const updatedProfile = this.profile();

    console.log('[ProfileStore] ATUALIZADO:', updatedProfile);

    console.log('[ProfileStore] PHYSICAL ITEMS:', updatedProfile.physical_items);

    this.appearanceStore.setFromProfile(updatedProfile);
  }

  updateProfile(data: Partial<ProfileModel>) {
    this.profile.update((state) => ({
      ...state,
      ...data,
    }));
  }

  // =========================================================
  // SOCIAL
  // =========================================================

  updateSocial(id: number, data: Partial<SocialLink>) {
    this.profile.update((state) => ({
      ...state,

      social_links: state.social_links.map((social) =>
        social.id === id
          ? {
              ...social,
              ...data,
            }
          : social,
      ),
    }));
  }

  // =========================================================
  // BUTTONS
  // =========================================================

  setButtons(buttons: Button[]) {
    this.profile.update((state) => ({
      ...state,
      buttons,
    }));
  }

  // =========================================================
  // MUSIC
  // =========================================================

  updateMusic(value: string, enabled: boolean) {
    this.profile.update((state) => ({
      ...state,

      music: {
        ...(state.music ?? {
          id: 0,
          type: 'music',
        }),

        value,
        enabled,
      },
    }));
  }

  // =========================================================
  // PORTFOLIO - IMAGENS
  // =========================================================

  setPortfolioImages(images: PortfolioImage[]) {
    this.profile.update((state) => ({
      ...state,

      portfolio_images: {
        ...state.portfolio_images,
        images,
      },
    }));
  }

  setPortfolioImagesEnabled(enabled: boolean) {
    this.profile.update((state) => ({
      ...state,

      portfolio_images: {
        ...state.portfolio_images,
        enabled,
      },
    }));
  }

  setPortfolioImagesData(data: { enabled: boolean; images: PortfolioImage[] }) {
    this.profile.update((state) => ({
      ...state,

      portfolio_images: {
        enabled: data.enabled,
        images: data.images ?? [],
      },
    }));
  }

  // =========================================================
  // PORTFOLIO - VÍDEOS
  // =========================================================

  setPortfolioVideos(videos: PortfolioVideo[]) {
    this.profile.update((state) => ({
      ...state,

      portfolio_videos: {
        ...state.portfolio_videos,
        videos,
      },
    }));
  }

  setPortfolioVideosEnabled(enabled: boolean) {
    this.profile.update((state) => ({
      ...state,

      portfolio_videos: {
        ...state.portfolio_videos,
        enabled,
      },
    }));
  }

  setPortfolioVideosData(data: { enabled: boolean; videos: PortfolioVideo[] }) {
    this.profile.update((state) => ({
      ...state,

      portfolio_videos: {
        enabled: data.enabled,
        videos: data.videos ?? [],
      },
    }));
  }

  // =========================================================
  // CONTACT
  // =========================================================

  setContactEnabled(enabled: boolean) {
    this.profile.update((state) => ({
      ...state,
      contact_enabled: enabled,
    }));
  }
}
