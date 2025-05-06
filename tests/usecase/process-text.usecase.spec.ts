import { describe, it, expect, beforeEach } from 'vitest';
import { ProcessTextUseCase } from '../../src/usecase/process-text.usecase';
import { IWeatherService } from '../../src/domain/weather/service/iweather';
import { Effect } from 'effect/index';

class MockWeatherService implements IWeatherService {
    chatWeather(text: string): Effect.Effect<string> {
        return Effect.promise(async () => {
            if (!text) throw new Error('テキストが空です');
            return `AI処理済み: ${text}`;
        });
    }
    getWeather(text: string): Effect.Effect<string> {
        return Effect.promise(async () => {
            return `天気情報: ${text}`;
        });
    }
}

describe('ProcessTextUseCase', () => {
    let useCase: ProcessTextUseCase;

    beforeEach(() => {
        useCase = new ProcessTextUseCase(new MockWeatherService());
    });

    it('テキストを受け取ってAI処理した結果を返す', async () => {
        const text = 'こんにちは、世界！';
        const result = await useCase.execute(text);

        expect(result).toBeTypeOf('string');
        expect(result).toContain('AI処理済み');
    });

    it('空のテキストを受け取った場合はエラーを返す', async () => {
        const text = '';
        await expect(useCase.execute(text)).rejects.toThrow('テキストが空です');
    });
});
