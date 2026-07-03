'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';

export type ColumnMeta = {
  key: string;
  label: string;
  /** Default width in px, used before the user customizes it. */
  defaultWidth?: number;
};

type ColumnManagerState = {
  order: string[];
  hidden: string[];
  widths?: Record<string, number>;
};

const MIN_COLUMN_WIDTH = 60;
const MAX_COLUMN_WIDTH = 600;
const WIDTH_STEP = 20;
const DEFAULT_COLUMN_WIDTH = 150;

function clampWidth(width: number): number {
  return Math.min(MAX_COLUMN_WIDTH, Math.max(MIN_COLUMN_WIDTH, width));
}

function loadState(storageKey: string): ColumnManagerState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.order) || !Array.isArray(parsed?.hidden)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveState(storageKey: string, state: ColumnManagerState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // ignore quota / privacy-mode errors
  }
}

/**
 * Manages column visibility + order for a table, persisted per `storageKey`.
 * `columns` is the canonical/default definition; reconciles stored state
 * against it so added/removed columns don't break persisted layouts.
 */
export function useColumnManager(storageKey: string, columns: ColumnMeta[]) {
  const defaultKeys = useMemo(() => columns.map(c => c.key), [columns]);

  const [order, setOrder] = useState<string[]>(defaultKeys);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [widths, setWidths] = useState<Record<string, number>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadState(storageKey);
    if (stored) {
      const known = new Set(defaultKeys);
      const reconciledOrder = [
        ...stored.order.filter(k => known.has(k)),
        ...defaultKeys.filter(k => !stored.order.includes(k)),
      ];
      setOrder(reconciledOrder);
      setHidden(new Set(stored.hidden.filter(k => known.has(k))));
      const knownWidths: Record<string, number> = {};
      for (const [k, w] of Object.entries(stored.widths ?? {})) {
        if (known.has(k)) knownWidths[k] = w;
      }
      setWidths(knownWidths);
    } else {
      setOrder(defaultKeys);
      setWidths({});
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Reconcile when the column definition itself changes shape (rare, e.g. conditional columns)
  useEffect(() => {
    if (!hydrated) return;
    setOrder(prev => {
      const known = new Set(defaultKeys);
      const next = [...prev.filter(k => known.has(k)), ...defaultKeys.filter(k => !prev.includes(k))];
      return next.length === prev.length && next.every((k, i) => k === prev[i]) ? prev : next;
    });
    setHidden(prev => {
      const known = new Set(defaultKeys);
      const next = new Set([...prev].filter(k => known.has(k)));
      return next.size === prev.size ? prev : next;
    });
    setWidths(prev => {
      const known = new Set(defaultKeys);
      const next: Record<string, number> = {};
      for (const [k, w] of Object.entries(prev)) {
        if (known.has(k)) next[k] = w;
      }
      return Object.keys(next).length === Object.keys(prev).length ? prev : next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultKeys.join('|'), hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveState(storageKey, {order, hidden: [...hidden], widths});
  }, [storageKey, order, hidden, widths, hydrated]);

  const toggleVisible = useCallback((key: string) => {
    setHidden(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const moveColumn = useCallback((fromKey: string, toKey: string) => {
    if (fromKey === toKey) return;
    setOrder(prev => {
      const from = prev.indexOf(fromKey);
      const to = prev.indexOf(toKey);
      if (from === -1 || to === -1) return prev;
      const next = [...prev];
      next.splice(from, 1);
      next.splice(to, 0, fromKey);
      return next;
    });
  }, []);

  const resetColumns = useCallback(() => {
    setOrder(defaultKeys);
    setHidden(new Set());
    setWidths({});
  }, [defaultKeys]);

  const columnsByKey = useMemo(() => new Map(columns.map(c => [c.key, c])), [columns]);

  const getWidth = useCallback(
    (key: string) => widths[key] ?? columnsByKey.get(key)?.defaultWidth ?? DEFAULT_COLUMN_WIDTH,
    [widths, columnsByKey]
  );

  const setColumnWidth = useCallback((key: string, width: number) => {
    setWidths(prev => ({...prev, [key]: clampWidth(width)}));
  }, []);

  const resizeColumn = useCallback((key: string, delta: number) => {
    setWidths(prev => {
      const current = prev[key] ?? columnsByKey.get(key)?.defaultWidth ?? DEFAULT_COLUMN_WIDTH;
      return {...prev, [key]: clampWidth(current + delta)};
    });
  }, [columnsByKey]);

  const increaseWidth = useCallback((key: string) => resizeColumn(key, WIDTH_STEP), [resizeColumn]);
  const decreaseWidth = useCallback((key: string) => resizeColumn(key, -WIDTH_STEP), [resizeColumn]);

  const orderedColumns = useMemo(() => {
    const byKey = new Map(columns.map(c => [c.key, c]));
    return order.map(k => byKey.get(k)).filter((c): c is ColumnMeta => !!c);
  }, [order, columns]);

  const visibleColumns = useMemo(
    () => orderedColumns.filter(c => !hidden.has(c.key)),
    [orderedColumns, hidden]
  );

  return {
    orderedColumns,
    visibleColumns,
    hidden,
    isHidden: (key: string) => hidden.has(key),
    toggleVisible,
    moveColumn,
    resetColumns,
    getWidth,
    setColumnWidth,
    increaseWidth,
    decreaseWidth,
    minColumnWidth: MIN_COLUMN_WIDTH,
    maxColumnWidth: MAX_COLUMN_WIDTH,
  };
}
