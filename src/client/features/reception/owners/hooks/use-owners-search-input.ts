import type { ChangeEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useOwnersSearch } from "./use-owners-search";

export function useOwnersSearchInput() {
  const { search, updateSearch } = useOwnersSearch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState(search.search);

  useEffect(() => {
    setSearchInput(search.search);
  }, [search.search]);

  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === search.search) {
      return;
    }

    const timer = setTimeout(() => {
      updateSearch({ search: trimmed, page: 1 });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, search.search, updateSearch]);

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchInput("");
    if (search.search !== "") {
      updateSearch({ search: "", page: 1 });
    }
    inputRef.current?.focus();
  }, [search.search, updateSearch]);

  return {
    inputRef,
    searchInput,
    hasSearchTerm: searchInput.length > 0,
    handleSearchChange,
    clearSearch,
  };
}
