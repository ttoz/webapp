import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WelcomeController } from './interfaces/controller/welcome.controller';
import { MastraService } from './domain/mastra/service/mastra.service';
import { ProcessTextUseCase } from './usecase/process-text.usecase';

@Module({
  imports: [],
  controllers: [AppController, WelcomeController],
  providers: [
    AppService,
    MastraService,
    {
      provide: ProcessTextUseCase,
      useFactory: (mastraService: MastraService) => new ProcessTextUseCase(mastraService),
      inject: [MastraService],
    },
  ],
})
export class AppModule {}
