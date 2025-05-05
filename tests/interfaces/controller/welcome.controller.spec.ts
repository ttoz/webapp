import { Test, TestingModule } from '@nestjs/testing';
import { WelcomeController } from '../../../src/interfaces/controller/welcome.controller';

describe('WelcomeController', () => {
  let controller: WelcomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WelcomeController],
    }).compile();

    controller = module.get<WelcomeController>(WelcomeController);
  });

  it('AIエージェントのウェルカムメッセージを返す', () => {
    const result = controller.getAIWelcome();
    expect(result).toContain('AIエージェントへようこそ');
  });

  it('AIで処理された結果を返す', async () => {
    const inputText = 'テスト入力';
    const result = await controller.postText(inputText);
    expect(result.processedText).toBe('AI処理済み: テスト入力');
  });
});
