import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Header,
  Req,
  type RawBodyRequest,
} from '@nestjs/common';
import type { Request } from 'express';
import { CurrentUser, Public } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import {
  DevConfirmPaymentDto,
  RazorpayWebhookDto,
  SubscriptionCheckoutDto,
} from './dto/payments.dto';
import { PaymentsService } from './payments.service';

@Controller('v1')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Public()
  @Get('subscriptions/plans')
  plans() {
    return this.paymentsService.listSubscriptionPlans();
  }

  @Post('subscriptions/checkout')
  checkout(
    @CurrentUser() user: AuthUser,
    @Body() dto: SubscriptionCheckoutDto,
  ) {
    return this.paymentsService.createSubscriptionCheckout(user, dto.planId);
  }

  @Post('jobs/:id/contact-orders')
  createContactOrder(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    return this.paymentsService.createContactOrder(user, id);
  }

  @Header('Cache-Control', 'no-store')
  @Get('jobs/:id/contact')
  getContact(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.paymentsService.getContact(user, id);
  }

  @Get('me/entitlements')
  entitlements(@CurrentUser() user: AuthUser) {
    return this.paymentsService.listEntitlements(user);
  }

  @Public()
  @Post('payments/webhooks/:gateway')
  webhook(
    @Param('gateway') gateway: string,
    @Body() body: RazorpayWebhookDto,
    @Headers('x-razorpay-signature') signature?: string,
    @Req() req?: RawBodyRequest<Request>,
  ) {
    const rawBody = req?.rawBody?.toString('utf8');
    return this.paymentsService.handleWebhook(
      gateway,
      body as unknown as Record<string, unknown>,
      signature,
      rawBody,
    );
  }

  /** Local/dev checkout completion when PAYMENT_MODE=stub (default). */
  @Post('payments/dev/confirm')
  confirmDev(
    @CurrentUser() user: AuthUser,
    @Body() dto: DevConfirmPaymentDto,
  ) {
    return this.paymentsService.confirmDevPayment(user, dto.orderId);
  }
}
