'use client';

import {useState} from 'react';
import {Dropdown} from '@/components/ui/dropdown/Dropdown';
import type {ColumnMeta} from '@/hooks/useColumnManager';
import { GridIcon } from '@/icons';

interface ColumnControlsProps {
  columns: ColumnMeta[];
  isHidden: (key: string) => boolean;
  onToggle: (key: string) => void;
  onReset: () => void;
  getWidth?: (key: string) => number;
  onIncreaseWidth?: (key: string) => void;
  onDecreaseWidth?: (key: string) => void;
  minWidth?: number;
  maxWidth?: number;
}

export default function ColumnControls(
  {columns, isHidden, onToggle, onReset, getWidth, onIncreaseWidth, onDecreaseWidth, minWidth, maxWidth}: ColumnControlsProps
) {
  const [isOpen, setIsOpen] = useState(false);
  const visibleCount = columns.filter(c => !isHidden(c.key)).length;
  const showWidthControls = !!(getWidth && onIncreaseWidth && onDecreaseWidth);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="dropdown-toggle flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors whitespace-nowrap"
        title="Mostrar, ocultar o redimensionar columnas"
      >
       <GridIcon />
        {visibleCount < columns.length && (
          <span className="ml-0.5 inline-flex items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-[10px] font-semibold w-4 h-4">
            {visibleCount}
          </span>
        )}
      </button>

      <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-64 max-h-96 overflow-y-auto">
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Columnas
          </span>
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
          >
            Restablecer
          </button>
        </div>
        <div className="py-1">
          {columns.map(col => {
            const width = getWidth?.(col.key);
            const atMin = width !== undefined && minWidth !== undefined && width <= minWidth;
            const atMax = width !== undefined && maxWidth !== undefined && width >= maxWidth;
            return (
              <div
                key={col.key}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <label className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!isHidden(col.key)}
                    onChange={() => onToggle(col.key)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-brand-500 focus:ring-brand-500 shrink-0"
                  />
                  <span className="truncate">{col.label}</span>
                </label>

                {showWidthControls && (
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      disabled={atMin}
                      onClick={() => onDecreaseWidth!(col.key)}
                      title="Reducir ancho"
                      className="w-5 h-5 flex items-center justify-center rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14"/>
                      </svg>
                    </button>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 w-7 text-center tabular-nums">
                      {width}
                    </span>
                    <button
                      type="button"
                      disabled={atMax}
                      onClick={() => onIncreaseWidth!(col.key)}
                      title="Aumentar ancho"
                      className="w-5 h-5 flex items-center justify-center rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Dropdown>
    </div>
  );
}
