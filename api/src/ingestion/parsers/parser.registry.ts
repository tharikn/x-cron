import { Injectable } from '@nestjs/common';
import { CsvParser } from './csv.parser';
import { ExcelParser } from './excel.parser';
import { ImageOcrParser } from './image-ocr.parser';
import { DocumentParser, ParseInput, ParseResult } from './parser.types';
import { TextParser } from './text.parser';

@Injectable()
export class ParserRegistry {
  private readonly parsers: DocumentParser[] = [
    new ExcelParser(),
    new CsvParser(),
    new TextParser(),
    new ImageOcrParser(),
  ];

  async parse(input: ParseInput): Promise<ParseResult> {
    const parser = this.parsers.find((item) => item.supports(input));
    if (!parser) {
      return {
        provider: 'none',
        sourceType: input.sourceType,
        drafts: [],
        warnings: [`No parser supports ${input.sourceType}/${input.filename}`],
      };
    }
    return parser.parse(input);
  }
}
