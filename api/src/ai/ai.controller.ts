import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser, Public, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { AuthThrottle, ChatThrottle } from '../security/decorators';
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
   * Signed-in in-app help assistant status (token budget + cooldown).
   * Guests never see the floating widget; this still requires a session.
   */
  @Get('help/status')
  helpStatus(@CurrentUser() user: AuthUser) {
    return {
      ...this.help.statusForUser(user.id),
      welcome: this.help.welcomeMessage(),
    };
  }

  /**
   * Lightweight app-help chat. Auth required. Heavy throttle + per-user
   * cooldown + daily token budget. Free/low model via AI_HELP_* env.
   */
  @ChatThrottle()
  @Post('help/chat')
  helpChat(@CurrentUser() user: AuthUser, @Body() dto: HelpChatDto) {
    return this.help.chat(user.id, dto.message, dto.history ?? []);
  }
}
