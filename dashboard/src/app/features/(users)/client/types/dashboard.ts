export interface DashboardFilters {
  period: string;
  start_at: string;
  end_at: string;
}

export interface DashboardSummary {
  profile_views: number;
  link_clicks: number;
  shares: number;
  qr_scans: number;
  nfc_scans: number;
}

export interface ViewsByDay {
  date: string;
  label: string;
  total: number;
}

export interface TopLink {
  target_type: string;
  target_id: number;
  label: string;
  total: number;
}

export interface DashboardCharts {
  views_by_day: ViewsByDay[];
  top_links: TopLink[];
}

export interface DashboardProfile {
  custom_url: string;
  public_url: string;
  tracked_url: string;
  profile_image: string;
}

export interface DashboardQuickAccess {
  edit_profile_url: string;
  social_links_url: string;
  buttons_url: string;
  vcard_url: string;
}

export interface DashboardClient {
  filters: DashboardFilters;
  summary: DashboardSummary;
  charts: DashboardCharts;
  profile: DashboardProfile;
  quick_access: DashboardQuickAccess;
}
