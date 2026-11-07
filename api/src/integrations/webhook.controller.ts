import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { Public } from '../auth/decorators';
import { AuthThrottle } from '../security/decorators';
import { IntegrationsService } from './integrations.service';

/** Public Zapier / ATS inbound webhook (token in path). */
@Controller('v1/integrations/webhooks')
export class WebhookController {
  constructor(private readonly integrations: IntegrationsService) {}

  @Public()
  @Post(':token')
  @AuthThrottle()
  ingest(
    @Param('token') token: string,
    @Body() body: Record<string, unknown>,
    @Headers('x-xcron-signature') sig?: string,
    @Headers('x-webhook-secret') secret?: string,
  ) {
    return this.integrations.ingestWebhook(
      token,
      body ?? {},
      sig || secret,
    );
  }
}
