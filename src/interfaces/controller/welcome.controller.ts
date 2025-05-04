import { Controller, Get, Render } from '@nestjs/common';

@Controller('welcome/aiagent')
export class WelcomeController {
  @Get()
  @Render('welcome/aiagent')
  getAIWelcome() {
    return { title: 'AIエージェントへようこそ', description: 'このページでは、AIエージェントの機能と役割について説明します。' };
  }
}