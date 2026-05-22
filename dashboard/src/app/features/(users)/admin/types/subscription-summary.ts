type MetricKey = 'active' | 'suspended' | 'pending' | 'canceled' | 'trial';

export interface MetricCard {
  key: MetricKey;
  label: string;
  icon: string; // nome do ícone (lucide, heroicons, etc)
  value: number;
}

export type SubscriptionSummary = Record<MetricKey, number>;
