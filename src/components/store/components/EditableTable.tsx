'use client';

import {createPortal} from 'react-dom';
import {useEffect, useMemo, useRef, useState} from 'react';
import {enhancedSearch} from '@/utils/searchUtils';
import Select from '@/components/form/Select';

// ── Types ────────────────────────────────────────────────────────────────────

export type ColumnDef = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'datetime-local' | 'date';
  readOnly?: boolean;
  /** Static option list for select */
  options?: {value: string; label: string}[];
  /** Async option loader for select (e.g. fetch categories from server) */
  loadOptions?: () => Promise<{value: string; label: string}[]>;
  /** Transform the raw stored value to the string the input expects */
  toInputValue?: (raw: any) => string;
  minWidth?: number;
  step?: number;
  min?: number | string;
  max?: number | string;
  /** Show a filter dropdown in the filter bar (only for select type) */
  filterable?: boolean;
  /** Show sort arrows in the column header */
  sortable?: boolean;
};

export type EditableTableChange = {
  id: string | number;
  data: Record<string, any>;
  isNew?: boolean;
};

export interface EditableTableProps {
  items: (Record<string, any> & {id: string | number})[];
  columns: ColumnDef[];
  onSave: (changes: EditableTableChange[]) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
  /** Remove the inner border/shadow so the component sits flush inside a parent card */
  noBorder?: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

type AsyncOptionsMap = Record<string, {value: string; label: string}[]>;
type EditStateMap = Record<string | number, Record<string, string>>;

function toStr(col: ColumnDef, val: any): string {
  if (col.toInputValue) return col.toInputValue(val);
  return val === null || val === undefined ? '' : String(val);
}

function buildEditState(
  items: EditableTableProps['items'],
  columns: ColumnDef[]
): EditStateMap {
  const state: EditStateMap = {};
  for (const row of items) {
    const rowState: Record<string, string> = {};
    for (const col of columns) {
      if (!col.readOnly) rowState[col.key] = toStr(col, row[col.key]);
    }
    state[row.id] = rowState;
  }
  return state;
}

function isRowModified(
  current: Record<string, string>,
  original: Record<string, any>,
  columns: ColumnDef[]
): boolean {
  return columns.some(col => {
    if (col.readOnly) return false;
    return current[col.key] !== toStr(col, original[col.key]);
  });
}

function castValue(col: ColumnDef, raw: string): any {
  if (raw === '' || raw === null || raw === undefined) return null;
  if (col.type === 'number') return Number(raw);
  if (col.key === 'status') return raw === 'true';
  return raw;
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SortIcon({active, asc}: {active: boolean; asc: boolean}) {
  if (!active) return (
    <svg className="w-3 h-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
    </svg>
  );
  return asc ? (
    <svg className="w-3 h-3 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7"/>
    </svg>
  ) : (
    <svg className="w-3 h-3 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function EditableTable({items, columns, onSave, onCancel, saving, noBorder}: EditableTableProps) {
  const originals = useRef(items.map(r => ({...r})));

  const [editState, setEditState] = useState<EditStateMap>(() =>
    buildEditState(items, columns)
  );

  // Async options
  const [asyncOptions, setAsyncOptions] = useState<AsyncOptionsMap>({});
  const [loadingCols, setLoadingCols] = useState<Set<string>>(new Set());

  useEffect(() => {
    const asyncCols = columns.filter(c => c.loadOptions);
    if (!asyncCols.length) return;
    setLoadingCols(new Set(asyncCols.map(c => c.key)));
    Promise.all(asyncCols.map(c => c.loadOptions!().then(opts => ({key: c.key, opts}))))
      .then(results => {
        const map: AsyncOptionsMap = {};
        for (const {key, opts} of results) map[key] = opts;
        setAsyncOptions(map);
        setLoadingCols(new Set());
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isLoading = loadingCols.size > 0;

  // Track which rows are modified
  const modifiedSet = useMemo(() => {
    const set = new Set<string | number>();
    for (const orig of originals.current) {
      const cur = editState[orig.id];
      if (cur && isRowModified(cur, orig, columns)) set.add(orig.id);
    }
    return set;
  }, [editState, columns]);

  // New (unsaved) rows - stored as temp IDs; values live in editState
  const [newRows, setNewRows] = useState<string[]>([]);
  const newCounter = useRef(0);

  const addNewRow = () => {
    const id = `__new__${newCounter.current++}`;
    const defaults: Record<string, string> = {};
    for (const col of columns) {
      if (col.readOnly) continue;
      if (col.type === 'select') {
        const opts = col.options ?? asyncOptions[col.key] ?? [];
        defaults[col.key] = opts[0]?.value ?? '';
      } else {
        defaults[col.key] = '';
      }
    }
    setNewRows(prev => [id, ...prev]);
    setEditState(prev => ({...prev, [id]: defaults}));
  };

  const removeNewRow = (id: string) => {
    setNewRows(prev => prev.filter(r => r !== id));
    setEditState(prev => {
      const next = {...prev};
      delete next[id];
      return next;
    });
  };

  const totalPendingCount = modifiedSet.size + newRows.length;

  // ── Navigation guard ────────────────────────────────────────────────────────
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const guardPushed = useRef(false);

  // Native browser dialog on refresh / tab-close / address-bar navigation
  useEffect(() => {
    if (totalPendingCount === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [totalPendingCount]);

  // Intercept <a> clicks (Next.js <Link> renders as <a>)
  useEffect(() => {
    if (totalPendingCount === 0) return;
    const handler = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a') as HTMLAnchorElement | null;
      if (!anchor?.href) return;
      try {
        const url = new URL(anchor.href, window.location.href);
        if (anchor.target === '_blank') return;
        if (url.protocol === 'javascript:') return;
        // Same-page hash jump — let it through
        if (url.hash && url.pathname === window.location.pathname && url.origin === window.location.origin) return;
      } catch { return; }
      e.preventDefault();
      e.stopPropagation();
      setPendingHref(anchor.href);
      setShowLeaveModal(true);
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [totalPendingCount]);

  // Push a history guard entry so the browser Back button triggers popstate
  useEffect(() => {
    if (totalPendingCount === 0 || guardPushed.current) return;
    history.pushState({_editGuard: true}, '');
    guardPushed.current = true;

    const onPop = () => {
      history.pushState({_editGuard: true}, ''); // re-push to stay in place
      setPendingHref(null); // null = "go back"
      setShowLeaveModal(true);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [totalPendingCount]);

  // Close leave modal with Escape
  useEffect(() => {
    if (!showLeaveModal) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowLeaveModal(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showLeaveModal]);

  const handleLeaveDiscard = () => {
    const href = pendingHref;
    setShowLeaveModal(false);
    guardPushed.current = false;
    onCancel();
    if (href) {
      window.location.href = href;
    } else {
      // Back-button case: go back past our guard entry
      history.go(-2);
    }
  };

  const handleLeaveCancel = () => {
    setShowLeaveModal(false);
    setPendingHref(null);
  };
  // ────────────────────────────────────────────────────────────────────────────

  // Filters & sort
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const filterableCols = columns.filter(c => c.filterable && c.type === 'select');
  const firstTextCol = columns.find(c => c.type === 'text' && !c.readOnly);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortAsc(p => !p);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filtersActive = !!(search || Object.values(filterValues).some(Boolean));
  const clearFilters = () => { setSearch(''); setFilterValues({}); };

  const visibleRows = useMemo(() => {
    let rows = originals.current;

    if (search.trim() && firstTextCol) {
      rows = rows.filter(r => {
        const val = editState[r.id]?.[firstTextCol.key] ?? '';
        return enhancedSearch(val, search);
      });
    }

    for (const [key, val] of Object.entries(filterValues)) {
      if (!val) continue;
      rows = rows.filter(r => (editState[r.id]?.[key] ?? '') === val);
    }

    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const va = (editState[a.id]?.[sortKey] ?? '').toLowerCase();
        const vb = (editState[b.id]?.[sortKey] ?? '').toLowerCase();
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }

    return rows;
  }, [editState, search, filterValues, sortKey, sortAsc, firstTextCol]);

  const updateCell = (id: string | number, key: string, value: string) => {
    setEditState(prev => ({...prev, [id]: {...prev[id], [key]: value}}));
  };

  const handleSave = () => {
    const changes: EditableTableChange[] = originals.current
      .filter(r => modifiedSet.has(r.id))
      .map(r => ({
        id: r.id,
        data: Object.fromEntries(
          columns
            .filter(c => !c.readOnly)
            .map(c => [c.key, castValue(c, editState[r.id]?.[c.key] ?? '')])
        ),
      }));
    const newChanges: EditableTableChange[] = newRows.map(id => ({
      id,
      isNew: true,
      data: Object.fromEntries(
        columns
          .filter(c => !c.readOnly)
          .map(c => [c.key, castValue(c, editState[id]?.[c.key] ?? '')])
      ),
    }));
    onSave([...changes, ...newChanges]);
  };

  const getOptions = (col: ColumnDef) => {
    if (col.options) return col.options;
    if (col.loadOptions) return asyncOptions[col.key] ?? [];
    return [];
  };

  const modifiedCount = modifiedSet.size;

  // ── Styles ────────────────────────────────────────────────────────────────
  const inputCls =
    'w-full bg-transparent border border-gray-200 dark:border-white/10 rounded-md px-2 py-1 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors';
  // When noBorder: break out of parent card padding so table is full-bleed
  const outerCls = noBorder
    ? '-mx-4 sm:-mx-6 -mb-4 sm:-mb-6 flex flex-col gap-3'
    : 'flex flex-col gap-3';
  const secPad = noBorder ? 'px-4 sm:px-6' : '';

  return (
    <div className={outerCls}>

      {/* ── Top bar ── */}
      <div className={`flex flex-wrap items-center justify-between gap-3 ${secPad}`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Modo edición
          </span>
          {modifiedCount > 0 && (
            <span className="text-sm text-amber-600 dark:text-amber-400">
              {modifiedCount} modificada{modifiedCount !== 1 ? 's' : ''}
            </span>
          )}
          {newRows.length > 0 && (
            <span className="text-sm text-green-600 dark:text-green-400">
              {newRows.length} nueva{newRows.length !== 1 ? 's' : ''}
            </span>
          )}
          {totalPendingCount === 0 && (
            <span className="text-sm text-gray-400 dark:text-gray-500">Sin cambios</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            disabled={saving || isLoading}
            onClick={addNewRow}
            className="flex items-center gap-1.5 rounded-lg border border-green-300 dark:border-green-700 px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-50">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            Añadir fila
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              if (totalPendingCount > 0) {
                setPendingHref(null);
                setShowLeaveModal(true);
              } else {
                onCancel();
              }
            }}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50">
            Cancelar
          </button>
          <button type="button" onClick={handleSave}
            disabled={totalPendingCount === 0 || saving || isLoading}
            className="flex items-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                Guardar{totalPendingCount > 0 ? ` (${totalPendingCount})` : ''}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className={`flex flex-wrap items-center gap-2 ${secPad}`}>
        {firstTextCol && (
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
            <input type="text"
              placeholder={`Buscar por ${firstTextCol.label.toLowerCase()}…`}
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>
        )}

        {filterableCols.map(col => (
          <div key={col.key} className="min-w-[150px]">
            <Select
              name={`filter-${col.key}`}
              value={filterValues[col.key] ?? ''}
              options={[{value: '', label: `Todos: ${col.label}`}, ...getOptions(col)]}
              onChange={val => setFilterValues(prev => ({...prev, [col.key]: String(val)}))}
              placeholder={`Todos: ${col.label}`}
              searchable
            />
          </div>
        ))}

        {filtersActive && (
          <button type="button" onClick={clearFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 border border-gray-200 dark:border-white/10 rounded-lg hover:border-red-300 dark:hover:border-red-500/40 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Limpiar
          </button>
        )}

        {filtersActive && (
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
            {visibleRows.length} de {items.length}
          </span>
        )}
      </div>

      {/* ── Table ── */}
      <div className={noBorder
        ? 'border-t border-gray-200 dark:border-white/5 overflow-hidden'
        : 'rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-gray-900 shadow-sm overflow-hidden'
      }>
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-full overflow-y-auto max-h-[65vh] scrollbar-primary">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="sticky top-0 z-10 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-white/[0.05]">
                  <th className="px-3 py-3 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    ID
                  </th>
                  {columns.map(col => (
                    <th key={col.key}
                      onClick={() => col.sortable && toggleSort(col.key)}
                      className={`px-3 py-3 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap${col.sortable ? ' cursor-pointer select-none' : ''}`}
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        {col.sortable && <SortIcon active={sortKey === col.key} asc={sortAsc}/>}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {newRows.map(id => (
                  <tr key={id} className="border-b border-green-100 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => removeNewRow(id)}
                          aria-label="Eliminar fila nueva"
                          className="w-4 h-4 rounded-full flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">nuevo</span>
                      </span>
                    </td>
                    {columns.map(col => {
                      if (col.readOnly) return (
                        <td key={col.key} className="px-3 py-2 whitespace-nowrap">
                          <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                        </td>
                      );
                      const value = editState[id]?.[col.key] ?? '';
                      const colOpts = getOptions(col);
                      const colLoading = loadingCols.has(col.key);
                      return (
                        <td key={col.key} className="px-3 py-2">
                          {col.type === 'select' && colLoading ? (
                            <div className="h-11 rounded-md bg-gray-100 dark:bg-white/5 animate-pulse"
                              style={{minWidth: col.minWidth ?? 110}}/>
                          ) : col.type === 'select' ? (
                            <div style={{minWidth: col.minWidth ?? 110}}>
                              <Select
                                name={`${col.key}-${id}`}
                                value={value}
                                options={colOpts}
                                onChange={val => updateCell(id, col.key, String(val))}
                                placeholder="— seleccionar —"
                                searchable
                              />
                            </div>
                          ) : col.type === 'textarea' ? (
                            <textarea aria-label={col.label} value={value} rows={1}
                              onChange={e => updateCell(id, col.key, e.target.value)}
                              className={`${inputCls} resize-none`}
                              style={{minWidth: col.minWidth ?? 200}}/>
                          ) : (
                            <input aria-label={col.label} type={col.type} value={value}
                              step={col.step} min={col.min} max={col.max}
                              onChange={e => updateCell(id, col.key, e.target.value)}
                              className={inputCls}
                              style={{minWidth: col.minWidth ?? (col.type === 'text' ? 160 : 100)}}
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {visibleRows.map(row => {
                  const modified = modifiedSet.has(row.id);
                  return (
                    <tr key={String(row.id)}
                      className={`border-b border-gray-100 dark:border-white/[0.03] last:border-b-0 transition-colors ${
                        modified
                          ? 'bg-amber-50 dark:bg-amber-900/10'
                          : 'bg-white dark:bg-gray-900 hover:bg-gray-50/50 dark:hover:bg-white/[0.01]'
                      }`}
                    >
                      {/* ID cell */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono select-none">
                          {modified && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 mb-0.5"/>
                          )}
                          {String(row.id)}
                        </span>
                      </td>

                      {columns.map(col => {
                        const value = editState[row.id]?.[col.key] ?? '';
                        const colOpts = getOptions(col);
                        const colLoading = loadingCols.has(col.key);

                        if (col.readOnly) {
                          return (
                            <td key={col.key} className="px-3 py-2 whitespace-nowrap">
                              <span className="text-sm text-gray-500 dark:text-gray-400">{value}</span>
                            </td>
                          );
                        }

                        return (
                          <td key={col.key} className="px-3 py-2">
                            {col.type === 'select' && colLoading ? (
                              <div className="h-11 rounded-md bg-gray-100 dark:bg-white/5 animate-pulse"
                                style={{minWidth: col.minWidth ?? 110}}/>
                            ) : col.type === 'select' ? (
                              <div style={{minWidth: col.minWidth ?? 110}}>
                                <Select
                                  name={`${col.key}-${String(row.id)}`}
                                  value={value}
                                  options={colOpts}
                                  onChange={val => updateCell(row.id, col.key, String(val))}
                                  placeholder="— seleccionar —"
                                  searchable
                                />
                              </div>
                            ) : col.type === 'textarea' ? (
                              <textarea
                                aria-label={col.label}
                                value={value} rows={1}
                                onChange={e => updateCell(row.id, col.key, e.target.value)}
                                className={`${inputCls} resize-none`}
                                style={{minWidth: col.minWidth ?? 200}}/>
                            ) : (
                              <input
                                aria-label={col.label}
                                type={col.type} value={value}
                                step={col.step} min={col.min} max={col.max}
                                onChange={e => updateCell(row.id, col.key, e.target.value)}
                                className={inputCls}
                                style={{minWidth: col.minWidth ?? (col.type === 'text' ? 160 : 100)}}
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Legend ── */}
      {(modifiedCount > 0 || newRows.length > 0) && (
        <p className={`text-xs flex items-center gap-4 flex-wrap ${secPad}`}>
          {modifiedCount > 0 && (
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400"/>
              {modifiedCount} fila{modifiedCount !== 1 ? 's' : ''} con cambios sin guardar.
            </span>
          )}
          {newRows.length > 0 && (
            <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400"/>
              {newRows.length} fila{newRows.length !== 1 ? 's' : ''} nueva{newRows.length !== 1 ? 's' : ''} por crear.
            </span>
          )}
        </p>
      )}

      {/* ── Unsaved changes modal (portal to body to escape stacking contexts) ── */}
      {showLeaveModal && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleLeaveCancel}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5"
            onClick={e => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <svg className="w-7 h-7 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
              </div>
            </div>

            {/* Title & description */}
            <div className="text-center">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Cambios sin guardar
              </h3>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Tienes{' '}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {totalPendingCount} fila{totalPendingCount !== 1 ? 's' : ''}
                </span>{' '}
                con cambios sin guardar. Si sales ahora perderás los cambios.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleLeaveDiscard}
                className="w-full rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                Descartar cambios y salir
              </button>
              <button
                type="button"
                onClick={handleLeaveCancel}
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Seguir editando
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
