import { useState, useEffect } from 'react';

// Pagination hook
export const usePagination = (initialPage = 1, initialPageSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const resetPagination = () => {
    setPage(1);
  };

  const goToPage = (newPage: number) => {
    setPage(newPage);
  };

  const changePageSize = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    resetPagination,
    goToPage,
    changePageSize,
  };
};

// Search hook
export const useSearch = (initialKeyword = '') => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [debouncedKeyword, setDebouncedKeyword] = useState(initialKeyword);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const clearSearch = () => {
    setKeyword('');
  };

  return {
    keyword,
    debouncedKeyword,
    setKeyword,
    clearSearch,
  };
};

// Filter hook
export const useFilters = <T extends Record<string, any>>(initialFilters: T) => {
  const [filters, setFilters] = useState<T>(initialFilters);

  const updateFilter = <K extends keyof T>(key: K, value: T[K]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const clearFilter = (key: keyof T) => {
    setFilters(prev => ({
      ...prev,
      [key]: initialFilters[key],
    }));
  };

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    clearFilter,
  };
};

// Combined hook for entities with pagination, search, and filters
export const useEntityList = <T extends Record<string, any>>(
  initialFilters: T,
  initialPage = 1,
  initialPageSize = 10
) => {
  const pagination = usePagination(initialPage, initialPageSize);
  const search = useSearch();
  const filters = useFilters(initialFilters);

  const resetAll = () => {
    pagination.resetPagination();
    search.clearSearch();
    filters.clearFilters();
  };

  return {
    ...pagination,
    ...search,
    ...filters,
    resetAll,
  };
};
