import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './mastra/workflows';
import { weatherAgent } from './mastra/agents';

import { Effect } from 'effect';
import { IWeatherService } from 'src/domain/weather/service/iweather';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WeatherService implements IWeatherService {
  /**
   * Mastraサンプルをサービスとして組み込み
   *
   * @param text
   * @returns
   */
  chatWeather(text: string): Effect.Effect<string, Error> {
    return Effect.promise(async () => {
      if (!text) throw new Error('テキストが空です');

      const mastra = new Mastra({
        workflows: { weatherWorkflow },
        agents: { weatherAgent },
        storage: new LibSQLStore({
          // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
          url: ':memory:',
        }),
        logger: createLogger({
          name: 'Mastra',
          level: 'info',
        }),
      });
      const agent = mastra.getAgent('weatherAgent');
      const res = await agent.generate(text);
      return res.text;
    });
  }

  getWeather(text: string): Effect.Effect<string, Error> {
    return Effect.promise(async () => {
      throw new Error('Not implemented');
    });
  }
}
