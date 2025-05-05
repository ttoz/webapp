import { Controller, Get, Post, Body, Render } from '@nestjs/common';
import { MastraService } from '../../domain/mastra/service/mastra.service';
import { ProcessTextUseCase } from '../../usecase/process-text.usecase';
import { Effect } from 'effect';

@Controller('welcome/aiagent')
export class WelcomeController {
  private readonly processTextUseCase: ProcessTextUseCase;

  constructor() {
    const mastraService = new MastraService();
    this.processTextUseCase = new ProcessTextUseCase(mastraService);
  }

  @Get()
  @Render('welcome/aiagent')
  getAIWelcome() {
    return {
      title: 'AIエージェントへようこそ',
      description: 'このページでは、AIエージェントの機能と役割について説明します。',
      postedText: '',
      processedText: ''
    };
  }

  @Post()
  @Render('welcome/aiagent')
  async postText(@Body('text') text: string) {
    let processedText = '';
    try {
      processedText = await this.processTextUseCase.execute(text);
    } catch (error) {
      processedText = 'エラーが発生しました: ' + (error instanceof Error ? error.message : String(error));
    }

    return {
      title: 'AIエージェントへようこそ',
      description: 'このページでは、AIエージェントの機能と役割について説明します。',
      postedText: text,
      processedText
    };
  }
}
