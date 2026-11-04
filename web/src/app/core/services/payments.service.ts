import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface UpiCheckoutDto {
  vpa: string;
  payeeName: string;
  intentUri: string;
  qrPayload: string;
}

export interface CheckoutDto {
  gateway: string;
  keyId: string | null;
  gatewayOrderId: string;
  amountPaise: number;
  currency: 'INR';
  checkoutMode: 'stub' | 'upi' | 'razorpay' | string;
  description: string;
  upi: UpiCheckoutDto | null;
}

export interface ContactOrderResponse {
  alreadyEntitled: boolean;
  entitlement: EntitlementDto | null;
  order: PaymentOrderDto | null;
  checkout: CheckoutDto | null;
}

export interface PaymentOrderDto {
  id: string;
  jobId: string;
  gateway: string;
  gatewayOrderId: string;
  amountPaise: number;
  currency: string;
  status: string;
  product: string;
}

export interface EntitlementDto {
  id: string;
  jobId: string;
  scope: string;
  status: string;
  validFrom: string;
  validUntil: string | null;
  createdAt: string;
}

export interface ContactRevealResponse {
  allowed: boolean;
  reason: string;
  message: string;
  entitlement?: EntitlementDto;
  contact: {
    phone: string | null;
    email: string | null;
    whatsapp: string | null;
    website: string | null;
  } | null;
}

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  createContactOrder(jobId: string): Promise<ContactOrderResponse> {
    return firstValueFrom(
      this.http.post<ContactOrderResponse>(
        `${environment.apiUrl}/jobs/${jobId}/contact-orders`,
        {},
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  confirmDevPayment(orderId: string): Promise<{
    order: PaymentOrderDto;
    entitlement: EntitlementDto | null;
  }> {
    return firstValueFrom(
      this.http.post<{ order: PaymentOrderDto; entitlement: EntitlementDto | null }>(
        `${environment.apiUrl}/payments/dev/confirm`,
        { orderId },
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  getContact(jobId: string): Promise<ContactRevealResponse> {
    return firstValueFrom(
      this.http.get<ContactRevealResponse>(
        `${environment.apiUrl}/jobs/${jobId}/contact`,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  listAdminHistory(params: {
    status?: string;
    from?: string;
    to?: string;
    limit?: number;
  } = {}): Promise<{
    items: PaymentHistoryRow[];
    orders: PaymentOrderDto[];
    total: number;
  }> {
    const q = new URLSearchParams();
    if (params.status) q.set('status', params.status);
    if (params.from) q.set('from', params.from);
    if (params.to) q.set('to', params.to);
    if (params.limit) q.set('limit', String(params.limit));
    const qs = q.toString();
    return firstValueFrom(
      this.http.get<{
        items: PaymentHistoryRow[];
        orders: PaymentOrderDto[];
        total: number;
      }>(
        `${environment.apiUrl}/admin/payments/history${qs ? `?${qs}` : ''}`,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  exportHistoryUrl(format: 'csv' | 'pdf', params: { status?: string } = {}): string {
    const q = new URLSearchParams();
    if (params.status) q.set('status', params.status);
    const qs = q.toString();
    return `${environment.apiUrl}/admin/payments/history/export.${format}${qs ? `?${qs}` : ''}`;
  }
}

export interface PaymentHistoryRow {
  id: string;
  createdAt: string;
  status: string;
  reason?: string;
  orderId?: string;
  userId?: string;
  actorId?: string;
  jobId?: string;
  product?: string;
  gateway?: string;
  gatewayOrderId?: string;
  amountPaise?: number;
  currency?: string;
  ip?: string;
  userAgent?: string;
}
