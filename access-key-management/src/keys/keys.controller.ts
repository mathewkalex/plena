import { Controller, Post, Body, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { KeysService } from './keys.service';
import { AccessKeyAuthGuard } from 'src/auth/auth.guard';

@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @UseGuards(AccessKeyAuthGuard)
  @Post()
  async createKey(
    @Body('userId') userId: string,
    @Body('rateLimit') rateLimit: number,
    @Body('expiration') expiration: Date,
  ) {
    return this.keysService.createKey(userId, rateLimit, expiration);
  }

  @UseGuards(AccessKeyAuthGuard)
  @Delete(':key')
  async deleteKey(@Param('key') key: string) {
    return this.keysService.deleteKey(key);
  }

  @UseGuards(AccessKeyAuthGuard)
  @Get()
  async listKeys() {
    return this.keysService.listKeys();
  }

  @UseGuards(AccessKeyAuthGuard)
  @Patch(':key')
  async updateKey(
    @Param('key') key: string,
    @Body('rateLimit') rateLimit: number,
    @Body('expiration') expiration: Date,
  ) {
    return this.keysService.updateKey(key, rateLimit, expiration);
  }

  @Get(':key')
  async getKeyDetails(@Param('key') key: string) {
    return this.keysService.getKeyDetails(key);
  }

  @Post(':key/disable')
  async disableKey(@Param('key') key: string) {
    return this.keysService.disableKey(key);
  }
}
