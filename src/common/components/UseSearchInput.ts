import { debounce } from '@utils/Util';
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import type { SearchInputProps } from './SearchInput';

export function useSearchInput<T>(props: SearchInputProps<T>) {
  const {
    onResults,
    onError,
    searchUrl,
    debounce: debounceDelay = 300,
  } = props;
  const abortControllerRef = useRef<AbortController>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchData = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim() || !searchUrl) return;

      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      try {
        setIsLoading(true);
        setError(null);

        const url = `${searchUrl}?q=${encodeURIComponent(searchQuery)}`;
        const response = await fetch(url, {
          signal: abortControllerRef.current.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        onResults(data);
      } catch (err) {
        const errorObj =
          err instanceof Error ? err : new Error('An error occurred');
        setError(errorObj.message);
        onError?.(errorObj);
      } finally {
        setIsLoading(false);
      }
    },
    [onError, onResults, searchUrl]
  );

  const debounceSearch = useMemo(
    () => debounce(searchData, debounceDelay),
    [debounceDelay, searchData]
  );

  const changeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      debounceSearch(e.currentTarget.value);
    },
    [debounceSearch]
  );

  return {
    changeHandler,
    isLoading,
    error,
  };
}
