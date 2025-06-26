import DeleteIcon from '@mui/icons-material/Delete';
import SeachIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { InputSearchComponent } from '~/components/InputSearchComponent';
import { MainComponent } from '~/components/MainComponent/MainComponent';
import { WeatherImageType } from '~/components/WeatherImageType';
import { DEFAULT_CITY } from '~/constants';
import { useForecast } from '~/hooks/useForecast';
import { useSearchHistory } from '~/hooks/useSearchHistory';
import { useWeather } from '~/hooks/useWeather';
import type { CityItem, WeatherDetail } from '~/types/Forecast';
import { getName, mathRound } from '~/utils';
import { isDayTime } from '~/utils/date';
import { formatWeatherCardItem } from '~/utils/weather';

const WeatherItems = (props: { items?: string[] }) => {
  const { items } = props;

  if (!items || !items?.length) {
    return null;
  }

  return (
    <>
      {items.map((item, index) => {
        return (
          <Typography key={`${item}-${index}`} className="text-[var()]">
            {item}
          </Typography>
        );
      })}
    </>
  );
};

export default function figma() {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>();
  const [weatherData, setWeatherData] = useState<
    { status: string } & WeatherDetail
  >();
  const { history, onAdd, onDelete } = useSearchHistory();
  const { loading, fetchForecast } = useForecast();
  const { loading: loadingWeather, fetchWeather } = useWeather();

  const weather = useMemo(
    () => formatWeatherCardItem(weatherData),
    [weatherData]
  );

  const weatherItems = useMemo(
    () =>
      [
        weather?.day,
        weather?.humidity && `Humidity: ${weather?.humidity}%`,
        weather?.status,
      ].filter(Boolean) as string[],
    [weather?.day, weather?.humidity, weather?.status]
  );

  const onSelect = useCallback(
    async (city: CityItem) => {
      if (
        city.name === weatherData?.name &&
        weatherData?.status !== 'not_found'
      ) {
        return;
      }

      const { data: dataWeather } = await fetchWeather({
        ...city.coord,
        units: 'metric',
      });
      setWeatherData(dataWeather);
    },
    [weatherData?.name, weatherData?.status, onAdd, fetchWeather]
  );

  const onSearch = useCallback(async () => {
    setSearch('');
    const { data, error } = await fetchForecast({
      q: search || '',
      units: 'metric',
    });
    if (error) {
      setWeatherData((pre) => ({ ...pre, status: 'not_found' } as any));
      return;
    }
    const { city } = data || {};
    onSelect(city);
    onAdd(city);
  }, [search, onSelect, fetchForecast]);

  useEffect(() => {
    onSelect(DEFAULT_CITY);
  }, []);

  return (
    <MainComponent defaultMode={isDayTime() ? 'light' : 'dark'}>
      <InputSearchComponent
        value={search}
        onChange={setSearch}
        onSearch={onSearch}
      />

      <Box
        className={clsx(
          'search--container relative bg-[var(--bg-color)] text-[var(--history-color)] backdrop-blur-[20px] border border-solid border-[var(--history-border-color)]',
          'lg:pt-[46px] lg:px-[40px] lg:mt-[112px] lg:rounded-[40px]',
          'pt-5 px-[20px] pb-6 mt-[140px] rounded-[20px]'
        )}
      >
        <Box className="absolute z-1 w-[157px] lg:w-[300px] h-[157px] lg:h-[300px] top-[-68px] lg:top-[-95px] right-[23px] lg:right-[40px]">
          <WeatherImageType type={weather?.status || 'Clouds'} />
        </Box>
        <Box className="todayCard flex items-end lg:block">
          <Box className="flex-1 min-w-0">
            <Typography
              component="h2"
              className="todayCard--title m-0 text-[14px] lg:text-[18px]"
            >
              Today's Weather
            </Typography>
            <Box
              component="p"
              className="todayCard--temparature-avg font-bold text-[50px] lg:text-[80px] leading-none text-[var(--highlight-temperature-color)]"
              dangerouslySetInnerHTML={{
                __html: `${
                  typeof weather?.temperature === 'string'
                    ? mathRound(parseInt(weather.temperature))
                    : 'N/A'
                }<sup>o</sup>`,
              }}
            />
            <Box className="todayCard--temperature flex gap-2 font-normal">
              <span
                dangerouslySetInnerHTML={{
                  __html: `H: ${weather?.temp_max || 'N/A'}<sup>o</sup>`,
                }}
              />
              <span
                dangerouslySetInnerHTML={{
                  __html: `L: ${weather?.temp_min || 'N/A'}<sup>o</sup>`,
                }}
              />
            </Box>
            <Box className="todayCard--location block lg:hidden font-bold text-[var(--today-item-color)]">
              {weather?.location}
            </Box>
            <Box className="hidden lg:flex justify-between text-[var(--today-item-color)]">
              <Box className="todayCard--location font-bold">
                {weather?.location}
              </Box>
              <WeatherItems items={weatherItems} />
            </Box>
          </Box>
          <Box className="flex flex-col-reverse items-end lg:hidden text-[var(--today-item-color)]">
            <WeatherItems items={weatherItems} />
          </Box>
        </Box>

        <Box className="search--history py-[22px] px-4 lg:p-5 mt-7 bg-[var(--bg-color)] rounded-[20px] lg:rounded-3xl">
          <Typography
            component="h2"
            className="title !text-[14px] lg:!text-[16px]"
            mb="26px"
          >
            Search History
          </Typography>
          <Box display="flex" flexDirection="column" gap="18px">
            {!history?.length && <Box>No record</Box>}
            {history?.map((item, index) => {
              const { id, search_time } = item;
              return (
                <Box
                  key={`${id}-${index}`}
                  width="100%"
                  display="flex"
                  gap="10px"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor="var(--history-item-bg)"
                  borderRadius="16px"
                  py="12px"
                  pr="16px"
                  pl="12px"
                >
                  <Box className="flex-1 min-w-0 flex flex-col lg:flex-row">
                    <Typography
                      component="h5"
                      flex={1}
                      minWidth={0}
                      className="search--history-item_name !text-[14px] lg:!text-[16px]"
                    >
                      {getName(item)}
                    </Typography>
                    <Typography
                      component="p"
                      className="search--history-item_time !text-[10px] !text-[var(--history-item-time-color)] lg:!text-[14px]"
                    >
                      {search_time}
                    </Typography>
                  </Box>
                  <Box display="flex" gap="10px">
                    <IconButton
                      onClick={() => onSelect(item)}
                      className="search--history-item_icon w-8 h-8 rounded-[50%] !bg-[var(--history-button-bg)] !border border-solid !border-[var(--history-button-border)]"
                    >
                      <SeachIcon className="!text-[16px] !text-[var(--history-button-color)]" />
                    </IconButton>
                    <IconButton
                      onClick={() => onDelete(item.id)}
                      className="search--history-item_icon w-8 h-8 rounded-[50%] !bg-[var(--history-button-bg)] !border border-solid !border-[var(--history-button-border)]"
                    >
                      <DeleteIcon className="!text-[16px] !text-[var(--history-button-color)]" />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Back to homepage */}
      <div className="fixed bottom-2 right-2">
        <button
          onClick={() => navigate('/')}
          className="font-bold text-lg text-neutral-100 cursor-pointer"
        >
          Back to mockup UI
        </button>
      </div>
    </MainComponent>
  );
}
