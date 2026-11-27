import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { CurrentUser, Public, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { AuthThrottle, ChatThrottle } from '../security/decorators';
import { extractClientIp, extractTabId } from '../security/token.util';
import { AiService } from './ai.service';
import { EnrichJobDto } from './dto/enrich-job.dto';
import { HelpChatDto } from './help/dto/help-chat.dto';
import { HelpChatService } from './help/help-chat.service';

@Controller('v1/ai')
export class AiController {
  constructor(
    private readonly ai: AiService,
    private readonly help: HelpChatService,
  ) {}

  /** Whether job-content AI enrich is on (safe for clients to gate UI). */
  @Public()
  @Get('status')
  status() {
    return this.ai.status();
  }

  /**
   * Preview / chatbot-style cleanup for a single job paste.
   * Does not publish; employer/admin can apply the result before create/import.
   * Costly LLM — auth throttle (monthly cap still in AiService).
   */
  @Roles('employer', 'admin')
  @AuthThrottle()
  @Post('job-enrich')
  enrich(@Body() dto: EnrichJobDto) {
    return this.ai.enrichJob(dto);
  }

  /**
   * In-app help assistant status (token budget + cooldown).
   * Guests get a per-tab anonymous quota; signed-in users keep theirs.
   */
  @Public()
  @Get('help/status')
  helpStatus(@Req() req: Request, @CurrentUser() user?: AuthUser) {
    return {
      ...this.help.statusForUser(this.quotaIdentity(req, user)),
      welcome: this.help.welcomeMessage(),
    };
  }

  /**
   * Lightweight app-help chat. Heavy throttle + per-quota cooldown and daily
   * token budget. Free/low model via AI_HELP_* env.
   */
  @Public()
  @ChatThrottle()
  @Post('help/chat')
  helpChat(
    @Req() req: Request,
    @CurrentUser() user: AuthUser | undefined,
    @Body() dto: HelpChatDto,
  ) {
    return this.help.chat(
      this.quotaIdentity(req, user),
      dto.message,
      dto.history ?? [],
    );
  }

  /**
   * Stable key for quota/cooldown. Signed-in users are keyed by user id;
   * guests by client IP + tab id so one tab cannot mint unlimited budgets.
   */
  private quotaIdentity(req: Request, user?: AuthUser): string {
    if (user?.id) return user.id;
    const ip = extractClientIp(req) ?? 'unknown-ip';
    const tab = extractTabId(req) ?? 'anon-tab';
    return `guest:${ip}:${tab}`;
  }
}
