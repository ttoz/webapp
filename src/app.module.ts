import { Module } from '@nestjs/common';
import { WelcomeController } from './interfaces/controller/welcome.controller';
import { ProcessTextUseCase } from './usecase/process-text.usecase';
import { WeatherService } from './infrastruture/weather/service.mastra';
import { ConstantTokens } from './app.constants';

@Module({
  imports: [],
  controllers: [WelcomeController],
  providers: [
    ProcessTextUseCase,
    {
      provide: ConstantTokens.WeatherService,
      useClass: WeatherService
    },
  ],
})
export class AppModule {}
