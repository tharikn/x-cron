import { Body, Controller, Get, Put } from '@nestjs/common';
import { Public, Roles } from '../auth/decorators';
import { UpdateCommerceDto } from './dto/update-commerce.dto';
import { UpdateFooterDto } from './dto/update-footer.dto';
import { SiteService } from './site.service';

@Controller('v1')
export class SiteController {
  constructor(private readonly site: SiteService) {}

  /** Public footer chrome — social, addresses, quick links (no private contacts). */
  @Public()
  @Get('site/footer')
  getFooter() {
    return this.site.getFooter();
  }

  /** Public commerce settings (unlock price only — no private contacts). */
  @Public()
  @Get('site/commerce')
  getCommerce() {
    return this.site.getCommerce();
  }

  @Roles('admin')
  @Put('admin/site/footer')
  updateFooter(@Body() dto: UpdateFooterDto) {
    return this.site.updateFooter(dto);
  }

  @Roles('admin')
  @Put('admin/site/commerce')
  updateCommerce(@Body() dto: UpdateCommerceDto) {
    return this.site.updateCommerce(dto);
  }
}
