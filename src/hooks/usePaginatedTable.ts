'use client';

import {useQuery} from '@tanstack/react-query';
import {useCallback, useMemo, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';

interface UsePaginatedTableOptions<T> {
  queryKey: string;
  initialData: T[];
  initialTotalCount: number;
  initialPage?: number;
  initialPageSize?: number;
  enableServerFetch?: boolean;
  fetchFn:
    (page: number, pageSize: number, orderBy?: string, ascending?: boolean, search?: string) =>
      Promise<{ items: T[]; count: number }>;
}

interface UsePaginatedTableReturn<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  isLoading: boolean;
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleSort: (column: string) => void;
  searchTerm: string;
  handleSearchChange: (value: string) => void;
}

export function usePaginatedTable<T>(
  {
    queryKey,
    initialData,
    initialTotalCount,
    initialPage = 1,
    initialPageSize = 10,
    enableServerFetch = true,
    fetchFn,
  }: UsePaginatedTableOptions<T>): UsePaginatedTableReturn<T> {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const {data, isLoading, isFetching} = useQuery({
    queryKey: [queryKey, currentPage, pageSize, sortBy, sortOrder, searchTerm],
    queryFn: async () => {
      return await fetchFn(
        currentPage,
        pageSize,
        sortBy || undefined,
        sortOrder === 'asc',
        searchTerm || undefined
      );
    },
    enabled: enableServerFetch,
    placeholderData: (previousData) => previousData, // Mantener datos previos mientras carga
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });

  const localData = useMemo(() => {
    let processedData = [...initialData];

    if (searchTerm.trim()) {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      processedData = processedData.filter((item) => {
        return Object.values(item as Record<string, unknown>).some((value) => {
          if (value == null) return false;
          return String(value).toLowerCase().includes(normalizedSearch);
        });
      });
    }

    if (sortBy) {
      processedData.sort((a, b) => {
        const aValue = (a as Record<string, unknown>)[sortBy];
        const bValue = (b as Record<string, unknown>)[sortBy];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortOrder === 'asc' ? -1 : 1;
        if (bValue == null) return sortOrder === 'asc' ? 1 : -1;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }

        const textA = String(aValue).toLowerCase();
        const textB = String(bValue).toLowerCase();
        if (textA < textB) return sortOrder === 'asc' ? -1 : 1;
        if (textA > textB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const totalCount = processedData.length;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    return {
      items: processedData.slice(start, end),
      count: totalCount,
    };
  }, [currentPage, initialData, pageSize, searchTerm, sortBy, sortOrder]);

  const items = enableServerFetch ? (data?.items ?? initialData) : localData.items;
  const totalCount = enableServerFetch ? (data?.count ?? initialTotalCount) : localData.count;

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    params.set('pageSize', pageSize.toString());
    router.push(`?${params.toString()}`, {scroll: false});
  }, [pageSize, router, searchParams]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    params.set('pageSize', size.toString());
    router.push(`?${params.toString()}`, {scroll: false});
  }, [router, searchParams]);

  const handleSort = useCallback((column: string) => {
    if (sortBy === column) {
      // Si ya está ordenado por esta columna, invertir orden
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Nueva columna, ordenar ascendente por defecto
      setSortBy(column);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Volver a la primera página al ordenar
  }, [sortBy, sortOrder]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Volver a la primera página al buscar
  }, []);

  return {
    items,
    currentPage,
    pageSize,
    totalCount,
    isLoading: isLoading || isFetching,
    sortBy,
    sortOrder,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    searchTerm,
    handleSearchChange,
  };
}
