import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { HelpChatService } from './help/help-chat.service';

@Module({
  controllers: [AiController],
  providers: [AiService, HelpChatService],
  exports: [AiService, HelpChatService],
})
export class AiModule {}
