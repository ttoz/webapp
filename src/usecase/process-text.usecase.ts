import { Inject } from '@nestjs/common';
import { Effect } from 'effect';
import { IWeatherService } from '../domain/weather/service/iweather';
import { ConstantTokens } from '../app.constants';
export class ProcessTextUseCase {
    constructor(
        @Inject(ConstantTokens.WeatherService)
        private readonly weatherService: IWeatherService,
    ) {}

    async execute(text: string): Promise<string> {
        const that = this;
        const program = Effect.gen(function* () {
            const str = yield* that.weatherService.chatWeather(text);
            return str;
        });
        return await Effect.runPromise(program);
    }
}
