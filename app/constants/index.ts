import type { CityItem } from '~/types/Forecast';

export const HISTORY_KEY = 'history';

export const CURRENT_CITY = 'current_city';

export const FORMAT_DAY_FULL = 'YYYY-MM-DD HH:mm A';

export const FORMAT_DAY_MONTH = 'DD MMM';

export const FORMAT_HOUR_MINUTE = 'HH:mm';

export const DEFAULT_CITY: CityItem = {
  id: 1566083,
  name: 'Ho Chi Minh City',
  coord: {
    lat: 10.75,
    lon: 106.6667,
  },
  country: 'VN',
  population: 1000000,
  timezone: 25200,
  sunrise: 1750804398,
  sunset: 1750850303,

  search_time: '',
};
