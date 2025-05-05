import { Module } from '@nestjs/common';
import { WelcomeController } from './interfaces/controller/welcome.controller';
import { ProcessTextUseCase } from './usecase/process-text.usecase';

@Module({
  imports: [],
  controllers: [WelcomeController],
  providers: [
    {
      provide: ProcessTextUseCase,
      useClass: ProcessTextUseCase,
    },
  ],
})
export class AppModule {}
