import Cookies from 'js-cookie';
import { useEffect, useMemo, useState } from 'react';
import { CURRENT_CITY, DEFAULT_CITY } from '~/constants';
import type { CityItem } from '~/types/Forecast';

export function useCurrentCity() {
  const [currentCity, setCurrentCity] = useState<CityItem>(DEFAULT_CITY);

  useEffect(() => {
    try {
      const currentCityCookie = Cookies.get(CURRENT_CITY);
      if (typeof currentCityCookie === 'string') {
        setCurrentCity(JSON.parse(currentCityCookie));
      }
    } catch (error) {}
  }, []);

  return useMemo(() => ({ currentCity, setCurrentCity }), [currentCity]);
}
