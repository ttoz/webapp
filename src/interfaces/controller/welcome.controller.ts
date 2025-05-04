import { Controller, Get, Post, Body, Render } from '@nestjs/common';

@Controller('welcome/aiagent')
export class WelcomeController {
  private postedText: string | null = null;

  @Get()
  @Render('welcome/aiagent')
  getAIWelcome() {
    return { 
      title: 'AIエージェントへようこそ', 
      description: 'このページでは、AIエージェントの機能と役割について説明します。', 
      postedText: this.postedText || '' 
    };
  }

  @Post()
  @Render('welcome/aiagent')
  postText(@Body('text') text: string) {
    this.postedText = text;
    return { title: 'AIエージェントへようこそ', description: 'このページでは、AIエージェントの機能と役割について説明します。', postedText: this.postedText };
  }
}
