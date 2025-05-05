import { Test, TestingModule } from '@nestjs/testing';
import { WelcomeController } from '../../../src/interfaces/controller/welcome.controller';
import { MastraService } from '../../../src/domain/mastra/service/mastra.service';
import { ProcessTextUseCase } from '../../../src/usecase/process-text.usecase';

describe('WelcomeController', () => {
  let controller: WelcomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WelcomeController],
      providers: [
        MastraService,
        {
          provide: ProcessTextUseCase,
          useFactory: (mastraService: MastraService) => new ProcessTextUseCase(mastraService),
          inject: [MastraService],
        },
      ],
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
    it('投稿されたテキストとAI処理された結果を返す', async () => {
      const inputText = 'テスト入力';
      const result = await controller.postText(inputText);
      
      expect(result.postedText).toBe(inputText);
      expect(result.processedText).toContain('AI処理済み');
    });

    it('空のテキストが投稿された場合はエラーメッセージを返す', async () => {
      const result = await controller.postText('');
      expect(result.processedText).toContain('エラーが発生しました');
      expect(result.processedText).toContain('テキストが空です');
    });
  });
});
