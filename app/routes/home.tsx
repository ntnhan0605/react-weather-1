import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isToday from 'dayjs/plugin/isToday';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEventHandler,
} from 'react';
import { FORMAT_DAY_FULL } from '~/constants';
import { useCurrentCity } from '~/hooks/useCurrentCity';
import { useForecast } from '~/hooks/useForecast';
import { useSearchHistory } from '~/hooks/useSearchHistory';
import { useWeather } from '~/hooks/useWeather';
import type { CityItem, WeatherDetail } from '~/types/Forecast';
import { getName } from '~/utils';
import { formatWeatherCardItem } from '~/utils/weather';
import type { Route } from './+types/home';
import { useNavigate } from 'react-router';

dayjs.extend(isToday);
dayjs.extend(customParseFormat);

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function HomePage() {
  const [query, setQuery] = useState<Record<string, any>>({});
  const { history, onAdd, onDelete } = useSearchHistory();
  const { loading, fetchForecast } = useForecast();
  const [weatherData, setWeatherData] = useState<
    { status: string } & WeatherDetail
  >();
  const { loading: loadingWeather, fetchWeather } = useWeather();
  const { currentCity } = useCurrentCity();

  const navigate = useNavigate();

  const weather = useMemo(
    () => formatWeatherCardItem(weatherData),
    [weatherData]
  );

  const temperature = useMemo(() => {
    if (weather?.temp_max && weather.temp_min) {
      return `${weather.temp_min} ~ ${weather.temp_max}`;
    }
    return `${weather?.temperature}`;
  }, [weather?.temp_max, weather?.temp_min, weather?.temperature]);

  const onSelect = useCallback(
    (city: CityItem) => {
      return async () => {
        if (
          city.name === weatherData?.name &&
          weatherData?.status !== 'not_found'
        ) {
          return;
        }

        const { data: dataWeather } = await fetchWeather({ ...city.coord });
        setWeatherData(dataWeather);
        onAdd(city);
      };
    },
    [weatherData?.name, weatherData?.status, onAdd]
  );

  const onRemove = useCallback(
    (city: CityItem) => {
      return () => {
        onDelete(city.id);
      };
    },
    [onDelete]
  );

  const onChangeSearch = useCallback(
    (key: string) => {
      return ((e) => {
        const val = e.target.value;
        const newQuery = { ...query, [key]: val };
        setQuery(newQuery);
      }) as ChangeEventHandler<HTMLInputElement> | undefined;
    },
    [query?.city, query?.country]
  );

  const onSearch = useCallback(async () => {
    const location = [query?.city, query?.country].filter(Boolean).join(',');
    if (!location) {
      return;
    }
    setQuery({});
    const { data, error } = await fetchForecast({
      q: location,
      units: 'metric',
    });
    if (error) {
      setWeatherData((pre) => ({ ...pre, status: 'not_found' } as any));
      return;
    }
    const { city } = data || {};

    onAdd(city);
    onSelect(city)();
  }, [query?.city, query?.country, history, fetchForecast, onSelect, onAdd]);

  const onReset = useCallback(() => {
    setQuery({});
  }, [query?.city, query?.country]);

  useEffect(() => {
    onSelect(currentCity)();
  }, []);

  return (
    <div className="container max-w-4xl mx-auto my-4 p-4 border border-solid border-gray-400 rounded-2xl">
      <div className="header border-b border-solid border-black">
        <h2 className="title text-2xl">Today's Weather</h2>
      </div>

      {/* Input search */}
      <div className="search-input-container flex gap-5 items-center py-4">
        <div className="flex gap-4 items-center">
          <p>City:</p>
          <input
            value={query?.city || ''}
            type="text"
            className="px-4 py-2 border border-solid border-neutral-200 rounded-xl"
            onChange={onChangeSearch('city')}
          />
        </div>
        <div className="flex gap-4 items-center">
          <p>Country:</p>
          <input
            value={query?.country || ''}
            type="text"
            className="px-4 py-2 border border-solid border-neutral-200 rounded-xl"
            onChange={onChangeSearch('country')}
          />
        </div>
        <div className="flex gap-2 items-center">
          <button
            className="button px-4 py-2 bg-neutral-300 rounded-xl cursor-pointer"
            onClick={onSearch}
          >
            Search
          </button>
          <button
            className="button px-4 py-2 bg-neutral-300 rounded-xl cursor-pointer"
            onClick={onReset}
          >
            Clear
          </button>
        </div>
      </div>

      {weatherData?.status === 'not_found' && (
        <div className="p-4 bg-red-200 border border-solid border-red-600 mb-10">
          Not found
        </div>
      )}
      {weatherData?.status !== 'not_found' && (
        <div className="highlight flex flex-col gap-1 px-6 py-4">
          <div className="location text-gray-400">{weather?.location}</div>
          <div className="status text-6xl font-bold mb-2">
            {weather?.status}
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-gray-400 min-w-">Description:</div>
            <div className="text-gray-900">{weather?.description}</div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-gray-400 min-w-">Temperature:</div>
            <div
              className="text-gray-900"
              dangerouslySetInnerHTML={{ __html: temperature }}
            />
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-gray-400 min-w-">Humidity:</div>
            <div className="text-gray-900">{weather?.humidity}%</div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-gray-400 min-w-">Time:</div>
            <div className="text-gray-900">{weather?.day}</div>
          </div>
        </div>
      )}

      {/* Search history */}
      <div className="search-history">
        <div className="header border-b-2 border-solid border-gray-600">
          <h2 className="title text-2xl">Search History</h2>
        </div>
        <div className="search-history-wrapper">
          {!history?.length && (
            <div className="text-center py-6">No Record</div>
          )}
          {history?.map((item, index) => {
            const { id, search_time } = item;
            const searchDay = dayjs(search_time, FORMAT_DAY_FULL);
            const time = searchDay.isToday()
              ? searchDay.format('HH:mm A')
              : search_time;
            return (
              <div
                key={`${id}-${index}`}
                className="flex gap-4 items-center py-4 border-b border-solid border-neutral-300"
              >
                <div className="country flex-1 min-w-0">
                  {index + 1}. {getName(item)}
                </div>
                <div className="time">{time}</div>
                <div className="flex gap-2">
                  <button
                    className="w-8 h-8 rounded-[50%] bg-neutral-100 cursor-pointer"
                    onClick={onSelect(item)}
                  >
                    <SearchIcon />
                  </button>
                  <button
                    className="w-8 h-8 rounded-[50%] bg-neutral-100 cursor-pointer"
                    onClick={onRemove(item)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="fixed bottom-2 right-2">
        <button
          onClick={() => navigate('/figma')}
          className="font-bold text-lg text-purple-500 cursor-pointer"
        >
          Continue new UI
        </button>
      </div>
    </div>
  );
}
