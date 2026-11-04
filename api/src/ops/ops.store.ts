import { Injectable } from '@nestjs/common';
import { OpsMetricCounters } from './ops.types';

@Injectable()
export class OpsStore {
  private readonly counters: OpsMetricCounters = {
    apiRequests: 0,
    searches: 0,
    jobPublishes: 0,
    contactUnlocks: 0,
    importBatches: 0,
    jobApplies: 0,
    ocrPages: 0,
    notificationsSent: 0,
    adImpressions: 0,
    adClicks: 0,
    promotionsSold: 0,
  };

  bump(key: keyof OpsMetricCounters, by = 1) {
    this.counters[key] += by;
  }

  snapshot(): OpsMetricCounters {
    return { ...this.counters };
  }
}
