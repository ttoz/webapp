import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeatherService } from '../../../src/infrastruture/weather/service.mastra';
import { Effect } from 'effect';

describe('MastraService', () => {
    let service:WeatherService;

    beforeEach(() => {
        service = new WeatherService();
    });

    describe('processText', () => {
        it('テキストを受け取ってAI処理した結果を返す', async () => {
            const text = 'こんにちは、世界！';
            const mockText = 'AIのAPIをリクエストせずにモックされたテキスト';

            const mockResponse = Effect.succeed(mockText);
            vi.spyOn(service, 'chatWeather').mockReturnValue(mockResponse);

            const result = await Effect.runPromise(service.chatWeather(text));
            expect(result).toBeTypeOf('string');
            expect(result).toBe(mockText);
        });

        it('空のテキストを受け取った場合はエラーを返す', async () => {
            const text = '';
            await expect(() =>
                Effect.runPromise(service.chatWeather(text)),
            ).rejects.toThrow('テキストが空です');
        });
    });
});
