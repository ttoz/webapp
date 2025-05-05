import { describe, it, expect } from 'vitest';
import { MastraService } from '../../../../src/domain/mastra/service/mastra.service';
import { Effect } from 'effect';

describe('MastraService', () => {
  const service = new MastraService();

  describe('processText', () => {
    it('テキストを受け取ってAI処理した結果を返す', () => {
      const text = 'こんにちは、世界！';
      const result = Effect.runSync(service.processText(text));
      
      expect(result).toBeTypeOf('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('空のテキストを受け取った場合はエラーを返す', () => {
      const text = '';
      expect(() => 
        Effect.runSync(service.processText(text))
      ).toThrow('テキストが空です');
    });
  });
});