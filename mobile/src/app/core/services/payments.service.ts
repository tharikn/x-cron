import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface ContactOrderResponse {
  alreadyEntitled: boolean;
  entitlement: EntitlementDto | null;
  order: PaymentOrderDto | null;
  checkout: {
    gateway: 'razorpay';
    keyId: string;
    gatewayOrderId: string;
    amountPaise: number;
    currency: 'INR';
    checkoutMode: 'stub' | 'razorpay';
    description: string;
  } | null;
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

  listEntitlements(): Promise<{
    items: EntitlementDto[];
    subscription: EntitlementDto | null;
  }> {
    return firstValueFrom(
      this.http.get<{ items: EntitlementDto[]; subscription: EntitlementDto | null }>(
        `${environment.apiUrl}/me/entitlements`,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  listSubscriptionPlans(): Promise<
    Array<{
      id: string;
      name: string;
      description: string;
      pricePaise: number;
      durationDays: number;
    }>
  > {
    return firstValueFrom(
      this.http.get<{
        items: Array<{
          id: string;
          name: string;
          description: string;
          pricePaise: number;
          durationDays: number;
        }>;
      }>(`${environment.apiUrl}/subscriptions/plans`),
    ).then((r) => r.items);
  }

  async checkoutSubscription(planId: string): Promise<EntitlementDto | null> {
    const orderResult = await firstValueFrom(
      this.http.post<{
        order: PaymentOrderDto;
        checkout: { checkoutMode: 'stub' | 'razorpay' };
      }>(
        `${environment.apiUrl}/subscriptions/checkout`,
        { planId },
        { headers: this.auth.authHeaders() },
      ),
    );
    if (orderResult.checkout.checkoutMode === 'stub') {
      const paid = await this.confirmDevPayment(orderResult.order.id);
      return paid.entitlement;
    }
    return null;
  }
}
