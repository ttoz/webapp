import { Effect } from 'effect';

export interface IWeatherService {
    chatWeather(msg: string): Effect.Effect<string, Error>;
    getWeather(location: string): Effect.Effect<string, Error>;
}
