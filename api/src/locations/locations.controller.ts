import { Controller, Get, Header, Query } from '@nestjs/common';
import { Public } from '../auth/decorators';
import { ListDistrictsDto, SearchLocationsDto } from './dto/locations.dto';
import { LocationsService } from './locations.service';

@Controller('v1/locations')
export class LocationsController {
  constructor(private readonly locations: LocationsService) {}

  /** All India states / UTs (LGD). */
  @Public()
  @Get('states')
  @Header('Cache-Control', 'public, max-age=86400, stale-while-revalidate=86400')
  states() {
    return this.locations.listStates();
  }

  /** Districts for one state LGD code. */
  @Public()
  @Get('districts')
  @Header('Cache-Control', 'public, max-age=86400, stale-while-revalidate=86400')
  districts(@Query() query: ListDistrictsDto) {
    return this.locations.listDistricts(query.stateCode);
  }

  /** Typeahead across states, districts, and towns (all India). */
  @Public()
  @Get('search')
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
  search(@Query() query: SearchLocationsDto) {
    return this.locations.search(query.q, query.limit ?? 12);
  }
}
