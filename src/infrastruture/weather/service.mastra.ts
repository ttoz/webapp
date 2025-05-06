import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './mastra/workflows';
import { weatherAgent } from './mastra/agents';

import { Effect } from 'effect';
import { IWeatherService, WeatherInfo, WeatherError } from 'src/domain/weather/service/iweather';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WeatherService implements IWeatherService {
    private mastra: Mastra;

    constructor() {
        this.mastra = new Mastra({
            workflows: { weatherWorkflow },
            agents: { weatherAgent },
            storage: new LibSQLStore({
                url: ':memory:',
            }),
            logger: createLogger({
                name: 'Mastra',
                level: 'info',
            }),
        });
    }

    chatWeather(text: string): Effect.Effect<string, Error> {
        return Effect.try({
            try: async () => {
                if (!text) throw new Error('テキストが空です');
    
                const agent = this.mastra.getAgent('weatherAgent');
                const res = await agent.generate(text);
                return res.text;
            },
            catch: (error) => new Error(error instanceof Error ? error.message : String(error))
        });
    }

    getWeather(location: string): Effect.Effect<WeatherInfo, WeatherError> {
        if (!location) {
            return Effect.fail({
                _tag: 'EmptyLocationError',
                message: '場所が指定されていません'
            });
        }

        return Effect.tryPromise({
            try: async () => {
                const agent = this.mastra.getAgent('weatherAgent');
                const prompt = `${location}の天気情報を以下のJSON形式で返してください:
                {
                    "location": "場所の名前",
                    "condition": "天気状態（晴れ、曇り、雨など）",
                    "temperature": 気温（数値）,
                    "humidity": 湿度（0-100の数値）,
                    "precipitationChance": 降水確率（0-100の数値）
                }
                回答は必ずこの形式のJSONのみを返してください。`;

                const res = await agent.generate(prompt);
                return JSON.parse(res.text) as WeatherInfo;
            },
            catch: () => ({
                _tag: 'WeatherFetchError',
                message: '天気情報の取得に失敗しました'
            })
        });
    }
}
