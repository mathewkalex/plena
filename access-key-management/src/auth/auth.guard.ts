import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AccessKeyAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    const accessKey = request.headers['access-key'] || request.query.accessKey || request.body.accessKey;

    if (!accessKey) {
      return false;
    }

    const isValidAccessKey = await this.authService.validateToken(accessKey);

    return isValidAccessKey;
  }
}
