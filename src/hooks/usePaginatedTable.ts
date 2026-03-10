'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface UsePaginatedTableOptions<T> {
  queryKey: string;
  initialData: T[];
  initialTotalCount: number;
  initialPage?: number;
  initialPageSize?: number;
  fetchFn: (page: number, pageSize: number, orderBy?: string, ascending?: boolean) => Promise<{ items: T[]; count: number }>;
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
}

export function usePaginatedTable<T>({
  queryKey,
  initialData,
  initialTotalCount,
  initialPage = 1,
  initialPageSize = 10,
  fetchFn,
}: UsePaginatedTableOptions<T>): UsePaginatedTableReturn<T> {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Query con cache automático de TanStack Query
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey, currentPage, pageSize, sortBy, sortOrder],
    queryFn: async () => {
      return await fetchFn(currentPage, pageSize, sortBy || undefined, sortOrder === 'asc');
    },
    placeholderData: (previousData) => previousData, // Mantener datos previos mientras carga
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });

  // Usar datos iniciales si no hay datos en cache aún
  const items = data?.items ?? initialData;
  const totalCount = data?.count ?? initialTotalCount;

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    params.set('pageSize', pageSize.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }, [pageSize, router, searchParams]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    params.set('pageSize', size.toString());
    router.push(`?${params.toString()}`, { scroll: false });
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
  };
}
