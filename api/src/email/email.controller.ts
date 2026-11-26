import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser, Public, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { AuthThrottle, SensitiveThrottle } from '../security/decorators';
import {
  SendEmailDto,
  SendOtpDto,
  VerifyOtpDto,
  SendRecoveryDto,
  SendJobAlertEmailDto,
  SetSenderConfigDto,
  SendVerificationEmailDto,
} from './dto/email.dto';
import { EmailService } from './email.service';

@Controller('v1')
export class EmailController {
  constructor(private readonly email: EmailService) {}

  // ── Transactional send (auth required) ────────────────────────
  @Post('email/send')
  @AuthThrottle()
  sendEmail(@Body() dto: SendEmailDto, @CurrentUser() user: AuthUser) {
    return this.email.send({
      to: dto.to,
      toName: dto.toName,
      subject: dto.subject,
      text: dto.text,
      html: dto.html,
      template: dto.template,
      templateData: dto.templateData,
      tenantId: dto.tenantId,
      category: dto.category,
      from: dto.from ? { email: dto.from } : undefined,
      fromName: dto.fromName,
      replyTo: dto.replyTo ? { email: dto.replyTo } : undefined,
      dedupeKey: dto.dedupeKey,
      metadata: { userId: user.id },
    });
  }

  // ── OTP (public, rate limited) ────────────────────────────────
  @Public()
  @SensitiveThrottle()
  @Post('email/otp/send')
  sendOtp(@Body() dto: SendOtpDto) {
    return this.email.sendOtp({
      email: dto.email,
      purpose: dto.purpose,
      recipientName: dto.recipientName,
    });
  }

  @Public()
  @SensitiveThrottle()
  @Post('email/otp/verify')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.email.verifyOtp({
      email: dto.email,
      code: dto.code,
      purpose: dto.purpose,
    });
  }

  // ── Verification (public, rate limited) ───────────────────────
  @Public()
  @SensitiveThrottle()
  @Post('email/verify')
  sendVerification(@Body() dto: SendVerificationEmailDto) {
    return this.email.sendVerificationEmail({
      email: dto.email,
      recipientName: dto.recipientName,
      verificationUrl: dto.verificationUrl,
    });
  }

  // ── Recovery (public, rate limited) ────────────────────────────
  @Public()
  @SensitiveThrottle()
  @Post('email/recovery')
  sendRecovery(@Body() dto: SendRecoveryDto) {
    return this.email.sendRecoveryEmail({
      email: dto.email,
      recipientName: dto.recipientName,
      recoveryUrl: dto.recoveryUrl,
    });
  }

  // ── Job alert email (auth required) ───────────────────────────
  @Post('email/job-alert')
  @AuthThrottle()
  sendJobAlert(@Body() dto: SendJobAlertEmailDto, @CurrentUser() user: AuthUser) {
    return this.email.sendJobAlertEmail({
      to: dto.to,
      jobTitle: dto.jobTitle,
      employerName: dto.employerName,
      city: dto.city,
      jobType: dto.jobType,
      salaryText: dto.salaryText,
      jobUrl: dto.jobUrl,
      summary: dto.summary,
      tenantId: dto.tenantId,
    });
  }

  // ── Welcome (auth required) ───────────────────────────────────
  @Post('email/welcome')
  @AuthThrottle()
  sendWelcome(@Body() body: { to: string; recipientName?: string; ctaUrl?: string }) {
    return this.email.sendWelcomeEmail({
      to: body.to,
      recipientName: body.recipientName,
      ctaUrl: body.ctaUrl,
    });
  }

  // ── Per-tenant sender config ──────────────────────────────────
  @Post('email/sender-config')
  @Roles('admin', 'employer')
  setSenderConfig(@Body() dto: SetSenderConfigDto, @CurrentUser() user: AuthUser) {
    return this.email.setSenderConfig(
      {
        tenantId: dto.tenantId,
        from: dto.from,
        fromName: dto.fromName,
        replyTo: dto.replyTo,
        enabled: dto.enabled,
      },
      user,
    );
  }

  @Get('email/sender-config')
  @Roles('admin', 'employer')
  getSenderConfig(@Query('tenantId') tenantId: string) {
    if (!tenantId) {
      throw new BadRequestException('tenantId required');
    }
    return this.email.getSenderConfig(tenantId);
  }

  @Get('email/sender-configs')
  @Roles('admin')
  listSenderConfigs() {
    return this.email.listSenderConfigs();
  }

  // ── Weekly digest trigger (admin) ─────────────────────────────
  @Post('email/weekly-digest/run')
  @Roles('admin')
  @SensitiveThrottle()
  runWeeklyDigest() {
    return this.email.runWeeklyJobsAlert();
  }
}
