import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeysModule } from './keys/keys.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [KeysModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
