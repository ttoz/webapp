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

    getWeather(city: string): Effect.Effect<WeatherInfo, Error> {
        return Effect.promise(async () => {
            if (!city) throw new Error('都市が指定されていません');

            const agent = this.mastra.getAgent('weatherAgent');
            const res = await agent.generate(city);
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

    planning(city: string): Effect.Effect<string, Error> {
        return Effect.promise(async () => {
            if (!city) throw new Error('都市が指定されていません');

            const wflow = this.mastra.getWorkflow('weatherWorkflow'); 
            const { runId, start } = await wflow.createRun();
            const runResult = await start({ triggerData: { city } });
            const { activePaths, results, timestamp } = runResult;
            console.log(runId, new Date(timestamp));
            if (activePaths.size === 0) { // Map型
                throw new Error('ワークフローが完了していません');
            }
            activePaths.forEach((pathData, stepId) => {
                console.log('stepId', stepId);
                console.log('pathStatus', pathData.status);
                console.log('pathStepPath', pathData.stepPath.join(','));
            });
            Object.entries(results).forEach(([ stepId, stepData ]) => {
                console.log('stepId', stepId);
                console.log('stepStatus', stepData.status);
                console.log('stepOutput', stepData['output']);
            });
            return JSON.stringify(results);
        });
    }
}
