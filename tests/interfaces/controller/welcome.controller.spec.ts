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

      // モックをコントローラーに注入
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
    it('投稿されたテキストとAI処理された結果を返す', async () => {
      mockProcessTextUseCase = {
        execute: vi.fn().mockResolvedValue('AI処理済み: テスト入力')
      };
      controller['processTextUseCase'] = mockProcessTextUseCase;

      const inputText = 'AI処理済み: テスト入力';
      const result = await controller.postText(inputText);
      expect(mockProcessTextUseCase.execute).toHaveBeenCalledWith(inputText);
      expect(result.postedText).toBe(inputText);
      expect(result.processedText).toBe('AI処理済み: テスト入力');
    });

    it('空のテキストが投稿された場合はエラーメッセージを返す', async () => {
      mockProcessTextUseCase = {
        execute: vi.fn().mockRejectedValue('テキストが空です')
      };
      controller['processTextUseCase'] = mockProcessTextUseCase;

      const inputText = '';
      const result = await controller.postText(inputText);
      expect(mockProcessTextUseCase.execute).toHaveBeenCalledWith(inputText);
      expect(result.processedText).toContain('エラーが発生しました');
      expect(result.processedText).toContain('テキストが空です');
    });
  });
});
