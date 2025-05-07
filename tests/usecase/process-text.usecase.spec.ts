import { describe, it, expect, beforeEach } from 'vitest';
import { ProcessTextUseCase } from '../../src/usecase/process-text.usecase';
import { IWeatherService, WeatherInfo } from '../../src/domain/weather/service/iweather';
import { Effect } from 'effect/index';

class MockWeatherService implements IWeatherService {
    chatWeather(text: string): Effect.Effect<string> {
        return Effect.promise(async () => {
            if (!text) throw new Error('テキストが空です');
            return `AI処理済み: ${text}`;
        });
    }
    getWeather(text: string): Effect.Effect<WeatherInfo> {
        return Effect.promise(async () => {
            return {
                location: '東京',
                conditions: '晴れ',
                temperature: 25,
                humidity: 60,
                precipitationChance: 10,
            };
        });
    }
    planning(text: string): Effect.Effect<string> {
        return Effect.promise(async () => {
            return `プラン: ${text}`;
        });
    }
}

describe('ProcessTextUseCase', () => {
    let useCase: ProcessTextUseCase;

    beforeEach(() => {
        useCase = new ProcessTextUseCase(new MockWeatherService());
    });

    describe('モード指定なし', () => {
        it('テキストを受け取ってAI処理した結果を返す', async () => {
            const text = 'こんにちは、世界！';
            const result = await useCase.execute(text, '');

            expect(result).toBeTypeOf('string');
            expect(result).toContain('AI処理済み');
        });

        it('空のテキストを受け取った場合はエラーを返す', async () => {
            const text = '';
            await expect(useCase.execute(text, '')).rejects.toThrow('テキストが空です');
        });
    });

    describe('JSONモード', () => {
        it('天気情報をJSON形式で返す', async () => {
            const text = '東京の天気';
            const result = await useCase.execute(text, 'json');

            expect(result).toBeTypeOf('string');
            expect(() => JSON.parse(result)).not.toThrow();
            expect(result).toContain('東京');
            expect(result).toContain('晴れ');
            expect(result).toContain('25');
            expect(result).toContain('60');
            expect(result).toContain('10');
        });
    });

    describe('プランニングモード', () => {
        it('プランを返す', async () => {
            const text = '明日の予定';
            const result = await useCase.execute(text, 'planning');

            expect(result).toBeTypeOf('string');
            expect(result).toContain('プラン');
        });
    });

    describe('チャットモード', () => {
        it('チャット応答を返す', async () => {
            const text = '天気について教えて';
            const result = await useCase.execute(text, 'chat');

            expect(result).toBeTypeOf('string');
            expect(result).toContain('AI処理済み');
        });
    });
});
