import { Controller, Get, Post, Body, Render } from '@nestjs/common';
import { ProcessTextUseCase } from '../../usecase/process-text.usecase';
import { json } from 'stream/consumers';

@Controller('welcome/aiagent')
export class WelcomeController {
    constructor(private processTextUseCase: ProcessTextUseCase) {}

    @Get()
    @Render('welcome/aiagent')
    getAIWelcome() {
        return {
            title: 'AIエージェントへようこそ',
            description:
                'このページでは、AIエージェントの機能と役割について説明します。',
            postedText: '',
            processedText: '',
        };
    }

    @Post()
    @Render('welcome/aiagent')
    async postText(
        @Body('text') text: string,
        @Body('mode') mode: string,
    ) {
        let processedText = '';
        try {
            processedText = await this.processTextUseCase.execute(
                text,
                mode,
            );
        } catch (error) {
            processedText =
                'エラーが発生しました: ' +
                (error instanceof Error ? error.message : String(error));
        }

        return {
            title: 'AIエージェントへようこそ',
            description:
                'このページでは、AIエージェントの機能と役割について説明します。',
            postedText: text,
            processedText,
        };
    }
}
