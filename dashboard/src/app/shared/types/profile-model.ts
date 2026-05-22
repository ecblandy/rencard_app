export interface SocialLink {
  id?: number;
  type: string;
  value: string;
  icon?: string;
  enabled: boolean;
}

export interface Button {
  id?: number;
  type: string;
  value: string;
  enabled: boolean;
}

export interface PortfolioImage {
  id: number;
  image: string;
  caption: string;
}

export interface PortfolioVideo {
  id: number;
  youtube_url: string;
}

export interface Music {
  id: number;
  type: string;
  value: string;
  enabled: boolean;
}

export interface Resume {
  id: number;
  file: string;
  enabled: boolean;
}

export interface ProfileModel {
  id: number;
  owner_name: string;
  background_color: string;
  font_color: string;
  background_image: string;
  profile_image: string;
  display_name: string;
  subtitle: string;
  custom_url: string;
  is_private: boolean;
  contact_enabled: boolean;
  resume: Resume | null;
  social_links: SocialLink[];
  buttons: Button[];
  portfolio_images: PortfolioImage[];
  portfolio_images_enabled: boolean;
  portfolio_videos: PortfolioVideo[];
  portfolio_videos_enabled: boolean;
  music: Music | null;
  button_bg_primary: string;
  button_bg_secondary: string;
  button_text_primary: string;
  button_text_secondary: string;
  text_primary: string;
  text_secondary: string;
  google_analytics_id: string;
  created_at: string;
  updated_at: string;
}
