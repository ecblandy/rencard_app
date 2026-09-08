export interface Resume {
  file: string | null;
  enabled: boolean;
}

export interface SocialLink {
  id: number;
  profile?: number;
  type: string;
  value: string;
  enabled: boolean;
  icon?: string;
}

export interface Button {
  id?: number;
  type: string;
  value: string;
  enabled: boolean;
}

export interface PortfolioImage {
  id: number;
  profile?: number;
  image: string;
  caption: string;
  created_at: string;
}

export interface PortfolioVideo {
  id: number;
  profile?: number;
  youtube_url: string;
  created_at: string;
}

export interface PortfolioImages {
  enabled: boolean;
  images: PortfolioImage[];
}

export interface PortfolioVideos {
  enabled: boolean;
  videos: PortfolioVideo[];
}

export interface Music {
  id: number;
  type: string;
  value: string;
  enabled: boolean;
}

/* ========================================================= */
/* USER / PLAN / ACCESS                                       */
/* ========================================================= */

export interface PhysicalItem {
  id: string;
  type: string;
  product_name: string;
  status: string;
  shipping_code: string;
  delivery_preview_date: string | null;
  order: number;
}

export interface Plan {
  id: number;
  name: string;
  description: string;
  features: string[];
  type: string;
  status?: string;
  end_at?: string | null;
  payment_method?: string | null;
}

export interface AccessPermissions {
  can_manage_profile: boolean;
  can_use_pro_features: boolean;
  plan_type: string;
}

export interface ActiveAccessGrant {
  id: number;
  plan: {
    id: number;
    name: string;
    description: string;
    features: string[];
    type: string;
  };
  source: string;
  start_at: string;
  end_at: string;
  permissions: AccessPermissions;
}

/* ========================================================= */
/* PROFILE                                                     */
/* ========================================================= */

export interface ProfileModel {
  id: number;

  /* User */
  role: string;
  full_name: string;
  username: string;
  email: string;
  phone_number: string;
  cpf_cnpj: string;

  /* Address */
  street: string;
  number: string;
  neighborhood: string;
  cep: string;
  complement: string;
  city: string;
  state: string;
  country: string;

  /* Profile */
  owner_name: string;
  google_analytics_id: string;

  background_color: string;
  text_primary: string;
  text_secondary: string;

  button_bg_primary: string;
  button_bg_secondary: string;

  button_text_primary: string;
  button_text_secondary: string;

  background_image: string | null;
  profile_image: string | null;

  qr_image?: string;

  display_name: string;
  subtitle: string;
  custom_url: string;

  is_private: boolean;
  contact_enabled: boolean;

  resume: Resume | null;

  social_links: SocialLink[];
  buttons: Button[];

  portfolio_images: PortfolioImages;
  portfolio_videos: PortfolioVideos;

  music: Music | null;

  /* Account */
  email_confirmed: boolean;
  last_payment_date: string | null;
  next_charge_date: string | null;
  terms_accepted: boolean;
  is_active: boolean;

  /* Physical products */
  physical_items: PhysicalItem[];

  /* Subscription */
  active_plan: Plan | null;
  active_access_grant: ActiveAccessGrant | null;
  pending_plan: Plan | null;

  /* Profile timestamps */
  created_at: string;
  updated_at: string;
}
