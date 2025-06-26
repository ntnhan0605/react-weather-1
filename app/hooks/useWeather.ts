import { useCallback, useMemo, useState } from 'react';
import { WeatherServices } from '~/services/weather';
import type { ForecastParams } from '~/types/Forecast';

export function useWeather() {
  const [loading, setLoading] = useState(false);

  const fetchWeather = useCallback(async (params: ForecastParams) => {
    setLoading(true);
    try {
      const res = await WeatherServices.getWeather(params);
      const { data } = res;
      if (!data) {
        throw new Error(JSON.stringify(res));
      }
      return { data, error: '' };
    } catch (error) {
      return { data: null, error: 'Nothing Found' };
    } finally {
      setLoading(false);
    }
  }, []);

  return useMemo(
    () => ({ loading, setLoading, fetchWeather }),
    [loading, fetchWeather]
  );
}
