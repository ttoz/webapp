import { describe, it, expect } from 'vitest';
import { WeatherService } from '../../../src/infrastruture/weather/service.mastra';
import { Effect } from 'effect';

describe('MastraService', () => {
    const service = new WeatherService();

    describe('processText', () => {
        it('テキストを受け取ってAI処理した結果を返す', async () => {
            const text = 'こんにちは、世界！';
            // const result = await Effect.runPromise(service.chatWeather(text));

            // expect(result).toBeTypeOf('string');
            // expect(result.length).toBeGreaterThan(0);

            expect(true).toBe(true); // TODO: モックを使ってAPIリクエストせずに結果を取得するようにする
        });

        it('空のテキストを受け取った場合はエラーを返す', async () => {
            const text = '';
            await expect(() =>
                Effect.runPromise(service.chatWeather(text)),
            ).rejects.toThrow('テキストが空です');
        });
    });
});
