import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FORMAT_DAY_FULL, HISTORY_KEY } from '~/constants';
import type { CityItem } from '~/types/Forecast';

export function useSearchHistory() {
  const [history, setHistory] = useState<CityItem[]>([]);

  const onDelete = useCallback(
    (id: number) => {
      const newHistory = history.filter((item) => item.id !== id);
      Cookies.set(HISTORY_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    },
    [history]
  );

  const onAdd = useCallback(
    (city: CityItem) => {
      const newHistory = history.filter((item) => item.id !== city.id);
      newHistory.unshift({
        ...city,
        search_time: dayjs().format(FORMAT_DAY_FULL),
      });
      setHistory(newHistory);
      Cookies.set(HISTORY_KEY, JSON.stringify(newHistory));
    },
    [history]
  );

  useEffect(() => {
    const historyList = (() => {
      try {
        const historyCookie = JSON.parse(Cookies.get(HISTORY_KEY) || '');
        return historyCookie;
      } catch (error) {
        return [];
      }
    })();
    setHistory(historyList);
  }, []);

  return useMemo(
    () => ({ history, setHistory, onAdd, onDelete }),
    [history, onAdd, onDelete]
  );
}
