export interface CostLineItem {
  key: string;
  label: string;
  unit: string;
  unitCostInr: number;
  monthlyEstimateInr: number;
  notes?: string;
}

export interface QuotaPolicy {
  key: string;
  label: string;
  limit: number;
  window: 'day' | 'month';
  used: number;
}

export interface OpsMetricCounters {
  apiRequests: number;
  searches: number;
  jobPublishes: number;
  contactUnlocks: number;
  importBatches: number;
  ocrPages: number;
  notificationsSent: number;
  adImpressions: number;
  adClicks: number;
  promotionsSold: number;
}
