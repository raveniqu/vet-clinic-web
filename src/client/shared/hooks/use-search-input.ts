import { useCallback, useRef } from "react";
import type { ChangeEvent, RefObject } from "react";

export interface UseSearchInputOptions {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export interface UseSearchInputReturn {
  inputRef: RefObject<HTMLInputElement | null>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  hasSearchTerm: boolean;
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
}

export function useSearchInput({
  searchTerm,
  setSearchTerm,
}: UseSearchInputOptions): UseSearchInputReturn {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    [setSearchTerm]
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    inputRef.current?.focus();
  }, [setSearchTerm]);

  return {
    inputRef,
    searchTerm,
    setSearchTerm,
    hasSearchTerm: searchTerm.length > 0,
    handleSearchChange,
    clearSearch,
  };
}
