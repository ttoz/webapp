import { Effect } from 'effect';

export interface WeatherInfo {
    location: string;
    conditions: string;
    temperature: number;
    humidity: number;
    precipitationChance: number;
}

// export type WeatherError =
//     | { _tag: 'EmptyLocationError'; message: string }
//     | { _tag: 'WeatherFetchError'; message: string };

export interface IWeatherService {
    chatWeather(msg: string): Effect.Effect<string, Error>;
    getWeather(location: string): Effect.Effect<WeatherInfo, Error>;
}
