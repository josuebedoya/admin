/**
 * Utilidades de búsqueda para usar en acciones del servidor
 * Complementa searchUtils.ts con versiones que filtran datos del lado del servidor
 */
import { normalizeText, enhancedSearch, getSearchScore } from './searchUtils';

/**
 * Filtra un array de objetos basado en búsqueda mejorada
 * Busca en las columnas especificadas
 */
export function filterBySearch<T extends Record<string, any>>(
  items: T[],
  query: string,
  searchColumns: (keyof T)[]
): T[] {
  if (!query || !searchColumns.length) return items;

  return items.filter((item) => {
    return searchColumns.some((column) => {
      const value = item[column];
      if (value == null) return false;
      return enhancedSearch(String(value), query);
    });
  });
}

/**
 * Filtra y ordena por relevancia
 * Útil para mostrar mejores resultados primero
 */
export function filterAndRankBySearch<T extends Record<string, any>>(
  items: T[],
  query: string,
  searchColumns: (keyof T)[]
): T[] {
  if (!query || !searchColumns.length) return items;

  const itemsWithScore = items
    .map((item) => {
      let maxScore = 0;
      searchColumns.forEach((column) => {
        const value = item[column];
        if (value != null) {
          const score = getSearchScore(String(value), query);
          maxScore = Math.max(maxScore, score);
        }
      });

      return { item, score: maxScore };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);

  return itemsWithScore;
}
