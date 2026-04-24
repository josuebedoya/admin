'use client';

import React, {useState} from 'react';
import {CircleArrowUpIcon, EllipsisVertical, Eye, PenLine, Trash2} from "lucide-react";
import {Dropdown} from "@/components/ui/dropdown";
import Link from "next/link";
import cn from "@utils/cn";

export type ControlsProps = {
  id?: string | number;
  link?: string;
  op?: {
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
    restore?: boolean;
  }
  onDeleted?: (id?: string | number) => void | Promise<void>;
  onRestored?: (id?: string | number) => void | Promise<void>;
}

const items = [
  {
    id: 'view',
    label: 'Ver',
    icon: <Eye className='w-4 h-4'/>,
    action: () => {
    },
    className: 'hover:bg-gray-100 !font-normal'
  },
  {
    id: 'edit',
    label: 'Editar',
    icon: <PenLine className='w-4 h-4'/>,
    action: () => {
    },
    className: 'hover:bg-gray-100 !font-normal'
  },
  {
    id: 'delete',
    label: 'Eliminar',
    icon: <Trash2 className='w-4 h-4'/>,
    action: () => {
    },
    className: 'text-red-700 hover:bg-red-100'
  },
  {
    id: 'restore',
    label: 'Restaurar',
    icon: <CircleArrowUpIcon className='w-4 h-4'/>,
    action: () => {
    },
    className: 'text-green-700 hover:bg-green-100'
  }
]

const Controls = (
  {
    id,
    link,
    op,
    onDeleted,
    onRestored
  }: ControlsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const ops = {
    view: op?.view ?? false,
    edit: op?.edit ?? true,
    delete: op?.delete ?? true,
    restore: op?.restore ?? false
  }

  const onDelete = async () => {
    await onDeleted?.(id);
    closeDropdown();
  }

  const onRestore = async () => {
    await onRestored?.(id);
    closeDropdown();
  }

  const classItem = 'flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md font-semibold text-sm';

  return (
    <div className='relative flex items-center justify-between gap-2'>
      <span className='p-1 hover:bg-gray-300  cursor-pointer rounded-full'
            onClick={() => setIsOpen(!isOpen)}
      ><EllipsisVertical/></span>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="mt-2 min-w-max right-1 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <ul className='p-2 flex flex-col gap-1'>
          {items.map((item) => ops[item.id as keyof typeof ops] && (
              <li key={item.id}>
                {item.id === 'view' || item.id === 'edit' ? (
                  <Link href={link || '#'}
                        className={cn([item.className, classItem])}>
                    {item.icon} {item.label}
                  </Link>
                ) : (
                  <div
                    className={cn([item.className, classItem])}
                    onClick={item.id === 'delete' ? onDelete : onRestore}
                  >
                    {item.icon} {item.label}
                  </div>
                )}
              </li>
            )
          )}
        </ul>
      </Dropdown>
    </div>
  );
};

export default Controls;