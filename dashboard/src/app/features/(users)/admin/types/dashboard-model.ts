export interface DashboardFilters {
  period: string;
}

export interface DashboardMetrics {
  revenue_cents: number;
  active_subscriptions: number;
  physical_sales: number;
  new_users: number;
}

export interface DashboardChart {
  labels: string[];
  new_users: number[];
  new_subscriptions: number[];
}

export interface CouponRecent {
  code: string;
  affiliate_name: string;
  uses: number;
  revenue_cents: number;
}

export interface DashboardCoupons {
  active_coupons: number;
  affiliates: number;
  total_uses: number;
  total_revenue_cents: number;
  recent: CouponRecent[];
}

export interface DashboardModel {
  filters: DashboardFilters;
  metrics: DashboardMetrics;
  chart: DashboardChart;
  coupons: DashboardCoupons;
}
