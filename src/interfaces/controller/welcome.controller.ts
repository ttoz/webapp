import { Controller, Get, Post, Body, Render } from '@nestjs/common';

@Controller('welcome/aiagent')
export class WelcomeController {
  private postedText: string | null = null;
  private processedText: string | null = null;

  @Get()
  @Render('welcome/aiagent')
  getAIWelcome() {
    return { 
      title: 'AIエージェントへようこそ', 
      description: 'このページでは、AIエージェントの機能と役割について説明します。', 
      postedText: this.postedText || '',
      processedText: this.processedText || ''
    };
  }

  @Post()
  @Render('welcome/aiagent')
  async postText(@Body('text') text: string) {
    this.postedText = text;
    this.processedText = await this.processTextWithAI(text);
    return { 
      title: 'AIエージェントへようこそ', 
      description: 'このページでは、AIエージェントの機能と役割について説明します。', 
      postedText: this.postedText, 
      processedText: this.processedText 
    };
  }

  private async processTextWithAI(text: string): Promise<string> {
    // mastraを利用してテキストを処理するロジックをここに実装
    return `AI処理済み: ${text}`;
  }
}
