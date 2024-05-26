import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenInfoModule } from './token-info/token-info.module';

@Module({
  imports: [TokenInfoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
