import { useCallback, useMemo, useState } from 'react';
import { WeatherServices } from '~/services/weather';
import type { ForecastParams } from '~/types/Forecast';

export function useForecast() {
  const [loading, setLoading] = useState(false);

  const fetchForecast = useCallback(async (params: ForecastParams) => {
    setLoading(true);
    try {
      const res = await WeatherServices.get5day3hours({
        ...params,
        units: 'metric',
      });
      const { list, city } = res.data || {};

      return { data: { list, city }, error: null };
    } catch (error: any) {
      const { response } = error;
      const { data } = response || {};
      return { data: null, error: data?.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return useMemo(
    () => ({ loading, setLoading, fetchForecast }),
    [loading, fetchForecast]
  );
}
