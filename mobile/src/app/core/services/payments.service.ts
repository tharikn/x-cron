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

  listEntitlements(): Promise<EntitlementDto[]> {
    return firstValueFrom(
      this.http.get<{ items: EntitlementDto[] }>(
        `${environment.apiUrl}/me/entitlements`,
        { headers: this.auth.authHeaders() },
      ),
    ).then((response) => response.items);
  }
}
