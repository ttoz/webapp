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
});