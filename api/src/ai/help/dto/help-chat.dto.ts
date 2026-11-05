import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { SanitizeText } from '../../../security/validation';

class HelpHistoryTurnDto {
  @IsIn(['user', 'assistant'])
  role!: 'user' | 'assistant';

  @SanitizeText({ allowNewlines: true })
  @IsString()
  @MinLength(1)
  @MaxLength(800)
  content!: string;
}

export class HelpChatDto {
  @SanitizeText({ allowNewlines: true })
  @IsString()
  @MinLength(1)
  @MaxLength(400)
  message!: string;

  /** Optional short prior turns (client-side only; server does not persist chat). */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(6)
  @ValidateNested({ each: true })
  @Type(() => HelpHistoryTurnDto)
  history?: HelpHistoryTurnDto[];
}
