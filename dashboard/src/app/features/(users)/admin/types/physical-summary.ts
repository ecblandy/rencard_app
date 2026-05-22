type MetricKey = 'delivered' | 'shipped' | 'in_production';

export interface MetricCard {
  key: MetricKey;
  label: string;
  icon: string;
  value: number;
}

export type PhysicalSummary = Record<MetricKey, number>;
