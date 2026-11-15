import { Module } from '@nestjs/common';
import { HandoffController, JwksController } from './handoff.controller';
import { HandoffService } from './handoff.service';

@Module({
  controllers: [HandoffController, JwksController],
  providers: [HandoffService],
})
export class HandoffModule {}
