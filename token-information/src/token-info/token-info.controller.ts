import { Controller, Get, Query } from '@nestjs/common';
import { TokenInfoService } from './token-info.service';

@Controller('token-info')
export class TokenInfoController {
  constructor(private readonly tokenInfoService: TokenInfoService) {}

  @Get()
  getTokenInfo(@Query('key') key: string) {
    return this.tokenInfoService.getTokenInfo(key);
  }
}
