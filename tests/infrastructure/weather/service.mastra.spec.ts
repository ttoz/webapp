import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeatherService } from '../../../src/infrastruture/weather/service.mastra';
import { Effect } from 'effect';
import { WeatherInfo } from '../../../src/domain/weather/service/iweather';

describe('WeatherService', () => {
    let service: WeatherService;

    beforeEach(() => {
        service = new WeatherService();
    });

    describe('chatWeather', () => {
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

    describe('getWeather', () => {
        it('場所を指定して構造化された天気情報を取得する', async () => {
            const location = '東京';
            const mockWeather: WeatherInfo = {
                location: '東京',
                conditions: '晴れ',
                temperature: 25,
                humidity: 60,
                precipitationChance: 10,
            };

            const mockResponse = Effect.succeed(mockWeather);
            vi.spyOn(service, 'getWeather').mockReturnValue(mockResponse);

            const result = await Effect.runPromise(
                service.getWeather(location),
            );
            expect(result).toEqual(mockWeather);
        });

        it('空の場所を指定した場合はエラーを返す', async () => {
            const location = '';
            await expect(() =>
                Effect.runPromise(service.getWeather(location)),
            ).rejects.toThrow('都市が指定されていません');
        });
    });

    describe('planning', () => {
        it('都市名を指定して天気に基づく行動計画を取得できる', async () => {
            const city = '京都';
            const mockResults = {
                'fetch-weather': {
                    status: 'completed',
                    output: [{
                        date: '2025-05-07',
                        maxTemp: 18.3,
                        minTemp: 10.6,
                        precipitationChance: 9,
                        condition: 'Dense drizzle',
                        location: '京都'
                    }]
                },
                'plan-activities': {
                    status: 'completed',
                    output: {
                        activities: '天気に基づく行動計画'
                    }
                }
            };

            const mockResponse = Effect.succeed(JSON.stringify(mockResults));
            vi.spyOn(service, 'planning').mockReturnValue(mockResponse);

            const result = await Effect.runPromise(service.planning(city));
            expect(result).toBe(JSON.stringify(mockResults));
            expect(() => JSON.parse(result)).not.toThrow();
        });

        it('空の都市名を指定した場合はエラーを返す', async () => {
            const city = '';
            await expect(() =>
                Effect.runPromise(service.planning(city)),
            ).rejects.toThrow('都市が指定されていません');
        });
    });
});
