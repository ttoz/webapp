import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WelcomeController } from './interfaces/controller/welcome.controller';

@Module({
  imports: [],
  controllers: [AppController, WelcomeController],
  providers: [AppService],
})
export class AppModule {}
