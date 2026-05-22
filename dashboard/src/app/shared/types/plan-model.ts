export interface Plan {
  id: number;
  name: string;
  description: string;
  features: string[];
  price_cents: number;
  type: 'basic' | 'pro' | 'galera';
  active: boolean;
}

export interface PlansResponse {
  results: Plan[];
  total_pages: number;
}
