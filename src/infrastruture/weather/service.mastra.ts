import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './mastra/workflows';
import { weatherAgent } from './mastra/agents';

import { Effect } from 'effect';
import {
    IWeatherService,
    WeatherInfo,
} from 'src/domain/weather/service/iweather';
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
        return Effect.promise(async () => {
            if (!text) throw new Error('テキストが空です');

            const agent = this.mastra.getAgent('weatherAgent');
            const res = await agent.generate(text);
            return res.text;
        });
    }

    getWeather(city_name: string): Effect.Effect<WeatherInfo, Error> {
        return Effect.promise(async () => {
            if (!city_name) throw new Error('都市が指定されていません');

            const agent = this.mastra.getAgent('weatherAgent');
            const res = await agent.generate(city_name);
            const [role_assistant1, role_tool, role_assistant2] =
                res.response.messages;
            const [{ type, result, toolName }] = role_tool.content as any;

            if (type !== 'tool-result')
                throw new Error(`ツールの結果が取得できませんでした:${type}`);
            if (toolName !== 'weatherTool')
                throw new Error(`天気情報のツールではありません:${toolName}`);

            const {
                conditions,
                location,
                temperature,
                humidity,
                feelsLike,
                windGust,
                windSpeed,
            } = result;
            return {
                conditions,
                location,
                temperature,
                humidity,
                precipitationChance: 0,
            } as WeatherInfo;
        });
    }
}
