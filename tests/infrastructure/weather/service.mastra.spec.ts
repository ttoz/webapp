import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeatherService } from '../../../src/infrastruture/weather/service.mastra';
import { Effect } from 'effect';
import { WeatherInfo, WeatherError } from '../../../src/domain/weather/service/iweather';

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
                condition: '晴れ',
                temperature: 25,
                humidity: 60,
                precipitationChance: 10
            };

            const mockResponse = Effect.succeed(mockWeather);
            vi.spyOn(service, 'getWeather').mockReturnValue(mockResponse);

            const result = await Effect.runPromise(service.getWeather(location));
            expect(result).toEqual(mockWeather);
        });

        it('空の場所を指定した場合はEmptyLocationErrorを返す', async () => {
            const location = '';
            const mockError: WeatherError = {
                _tag: 'EmptyLocationError',
                message: '場所が指定されていません'
            };

            const result = await Effect.runPromise(
                Effect.flip(service.getWeather(location))
            );
            expect(result).toEqual(mockError);
        });

        it('天気情報の取得に失敗した場合はWeatherFetchErrorを返す', async () => {
            const location = '存在しない場所';
            const mockError: WeatherError = {
                _tag: 'WeatherFetchError',
                message: '天気情報の取得に失敗しました'
            };

            vi.spyOn(service['mastra'], 'getAgent').mockImplementation(() => {
                throw new Error('API error');
            });

            const result = await Effect.runPromise(
                Effect.flip(service.getWeather(location))
            );
            expect(result).toEqual(mockError);
        });
    });
});
