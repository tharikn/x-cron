import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateFeedbackThreadDto {
  @IsIn(['seeker', 'employer'])
  audience!: 'seeker' | 'employer';

  @IsIn(['question', 'bug', 'suggestion', 'account', 'other'])
  category!: 'question' | 'bug' | 'suggestion' | 'account' | 'other';

  @IsString()
  @MinLength(3)
  @MaxLength(120)
  subject!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  body!: string;
}

export class SendFeedbackMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  body!: string;
}

export class ListAdminFeedbackQueryDto {
  @IsOptional()
  @IsIn(['open', 'awaiting_admin', 'awaiting_user', 'closed', 'all'])
  status?: 'open' | 'awaiting_admin' | 'awaiting_user' | 'closed' | 'all';

  @IsOptional()
  @IsIn(['seeker', 'employer'])
  audience?: 'seeker' | 'employer';
}

/** Composer heartbeat — WhatsApp-style typing indicator. */
export class FeedbackTypingDto {
  @IsBoolean()
  typing!: boolean;
}
