import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { WelcomeController } from '../../../src/interfaces/controller/welcome.controller';

describe('WelcomeController', () => {
    let controller: WelcomeController;
    let mockProcessTextUseCase;

    beforeEach(async () => {
        // モジュールの再構築
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WelcomeController],
        }).compile();
        controller = module.get<WelcomeController>(WelcomeController);
    });

    describe('getAIWelcome', () => {
        it('初期表示時は空の状態を返す', () => {
            const result = controller.getAIWelcome();
            expect(result.title).toBe('AIエージェントへようこそ');
            expect(result.postedText).toBe('');
            expect(result.processedText).toBe('');
        });
    });

    describe('postText', () => {
        describe('モード指定なし', () => {
            it('投稿されたテキストとAI処理された結果を返す', async () => {
                mockProcessTextUseCase = {
                    execute: vi.fn().mockResolvedValue('AI処理済み: テスト入力'),
                };
                controller['processTextUseCase'] = mockProcessTextUseCase;

                const inputText = 'AI処理済み: テスト入力';
                const result = await controller.postText(inputText, '');
                expect(mockProcessTextUseCase.execute).toHaveBeenCalledWith(
                    inputText,
                    '',
                );
                expect(result.postedText).toBe(inputText);
                expect(result.processedText).toBe('AI処理済み: テスト入力');
            });

            it('空のテキストが投稿された場合はエラーメッセージを返す', async () => {
                mockProcessTextUseCase = {
                    execute: vi.fn().mockRejectedValue('テキストが空です'),
                };
                controller['processTextUseCase'] = mockProcessTextUseCase;

                const inputText = '';
                const result = await controller.postText(inputText, '');
                expect(mockProcessTextUseCase.execute).toHaveBeenCalledWith(
                    inputText,
                    '',
                );
                expect(result.processedText).toContain('エラーが発生しました');
                expect(result.processedText).toContain('テキストが空です');
            });
        });

        describe('JSONモード', () => {
            it('JSON形式の天気情報を返す', async () => {
                const mockJsonResponse = JSON.stringify({ weather: '晴れ', temperature: 25 });
                mockProcessTextUseCase = {
                    execute: vi.fn().mockResolvedValue(mockJsonResponse),
                };
                controller['processTextUseCase'] = mockProcessTextUseCase;

                const inputText = '東京の天気';
                const result = await controller.postText(inputText, 'json');
                expect(mockProcessTextUseCase.execute).toHaveBeenCalledWith(
                    inputText,
                    'json',
                );
                expect(result.postedText).toBe(inputText);
                expect(result.processedText).toBe(mockJsonResponse);
                expect(() => JSON.parse(result.processedText)).not.toThrow();
            });
        });

        describe('プランニングモード', () => {
            it('プランニング結果を返す', async () => {
                const mockPlanningResponse = '1. 朝の会議\n2. 昼食\n3. 開発作業';
                mockProcessTextUseCase = {
                    execute: vi.fn().mockResolvedValue(mockPlanningResponse),
                };
                controller['processTextUseCase'] = mockProcessTextUseCase;

                const inputText = '明日の予定';
                const result = await controller.postText(inputText, 'planning');
                expect(mockProcessTextUseCase.execute).toHaveBeenCalledWith(
                    inputText,
                    'planning',
                );
                expect(result.postedText).toBe(inputText);
                expect(result.processedText).toBe(mockPlanningResponse);
            });
        });

        describe('チャットモード', () => {
            it('チャット応答を返す', async () => {
                const mockChatResponse = 'はい、お手伝いできます。';
                mockProcessTextUseCase = {
                    execute: vi.fn().mockResolvedValue(mockChatResponse),
                };
                controller['processTextUseCase'] = mockProcessTextUseCase;

                const inputText = '手伝ってください';
                const result = await controller.postText(inputText, 'chat');
                expect(mockProcessTextUseCase.execute).toHaveBeenCalledWith(
                    inputText,
                    'chat',
                );
                expect(result.postedText).toBe(inputText);
                expect(result.processedText).toBe(mockChatResponse);
            });
        });
    });
});
