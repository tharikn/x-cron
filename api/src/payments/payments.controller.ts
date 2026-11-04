import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Header,
  Req,
  Query,
  Res,
  type RawBodyRequest,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { CurrentUser, Public, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { AuthThrottle, SensitiveThrottle } from '../security/decorators';
import {
  DevConfirmPaymentDto,
  RazorpayWebhookDto,
  SubscriptionCheckoutDto,
} from './dto/payments.dto';
import { PaymentHistoryQueryDto } from './dto/history-query.dto';
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

  @Post('jobs/:id/post-orders')
  createPostJobOrder(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    return this.paymentsService.createPostJobOrder(user, id);
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

  @Roles('admin')
  @Get('admin/payments/history')
  adminHistory(@Query() query: PaymentHistoryQueryDto) {
    return this.paymentsService.listAdminHistory(query);
  }

  @Roles('admin')
  @Get('admin/payments/history/export.csv')
  async exportCsv(
    @Query() query: PaymentHistoryQueryDto,
    @Res() res: Response,
  ) {
    const buf = await this.paymentsService.exportHistoryExcel(query);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="xcron-payment-history.csv"`,
    );
    res.send(buf);
  }

  @Roles('admin')
  @Get('admin/payments/history/export.pdf')
  async exportPdf(
    @Query() query: PaymentHistoryQueryDto,
    @Res() res: Response,
  ) {
    const buf = await this.paymentsService.exportHistoryPdf(query);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="xcron-payment-history.pdf"`,
    );
    res.send(buf);
  }

  @Public()
  @AuthThrottle()
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

  /**
   * Dev / local UPI confirm only.
   * Blocked in production; 1/hour; ownership + TTL checked; failures logged.
   */
  @SensitiveThrottle()
  @Post('payments/dev/confirm')
  confirmDev(
    @CurrentUser() user: AuthUser,
    @Body() dto: DevConfirmPaymentDto,
    @Req() req: Request,
  ) {
    const ip =
      (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ||
      req.ip;
    const userAgent = req.headers['user-agent'];
    return this.paymentsService.confirmDevPayment(user, dto.orderId, {
      ip,
      userAgent,
    });
  }
}
