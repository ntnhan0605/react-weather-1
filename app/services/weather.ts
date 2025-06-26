import type { ForecastParams } from '~/types/Forecast';
import { AxiosBase } from '.';

export const WeatherServices = {
  get5day3hours(params: ForecastParams) {
    return AxiosBase.get('forecast', { params });
  },
  getWeather(params: ForecastParams) {
    return AxiosBase.get('weather', { params });
  },
};
