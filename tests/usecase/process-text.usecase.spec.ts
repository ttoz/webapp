import { describe, it, expect, beforeEach } from 'vitest';
import { ProcessTextUseCase } from '../../src/usecase/process-text.usecase';
import { MastraService } from '../../src/domain/mastra/service/mastra.service';
import { Effect } from 'effect';

describe('ProcessTextUseCase', () => {
  let useCase: ProcessTextUseCase;
  let mastraService: MastraService;

  beforeEach(() => {
    mastraService = new MastraService();
    useCase = new ProcessTextUseCase(mastraService);
  });

  it('テキストを受け取ってAI処理した結果を返す', async () => {
    const text = 'こんにちは、世界！';
    const result = await Effect.runPromise(useCase.execute(text));
    
    expect(result).toBeTypeOf('string');
    expect(result).toContain('AI処理済み');
  });

  it('空のテキストを受け取った場合はエラーを返す', async () => {
    const text = '';
    await expect(Effect.runPromise(useCase.execute(text)))
      .rejects
      .toThrow('テキストが空です');
  });
});