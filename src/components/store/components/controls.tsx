import React, {useState} from 'react';
import {EyeIcon, MenuDots, PencilIcon, RestoreIcon, TrashBinIcon} from "@/icons";
import {Dropdown} from "@/components/ui/dropdown/Dropdown";
import Link from "next/link";
import {deleteProduct, restoreProduct} from "@/server/actions/store";

export type ControlsProps = {
  id?: string | number;
  link?: string;
  op?: {
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
    restore?: boolean;
  }
  module?: 'products' | 'categories' | 'shelves' | 'daily-sales' | 'reports';
  onDeleted?: () => void | Promise<void>;
  onRestored?: () => void | Promise<void>;
}

const Controls = (
  {
    id,
    link,
    op,
    module,
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
    if (module === 'products' && id) {
      await deleteProduct(id)
    }

    await onDeleted?.();
    closeDropdown();
  }

  const onRestore = async () => {
    if (module === 'products' && id) {
      await restoreProduct(id)
    }
    await onRestored?.();
    closeDropdown();
  }

  return (
    <div className='relative flex items-center justify-between gap-2'>
      <span className='p-1 hover:bg-gray-300 rounded-sm svg-img-options cursor-pointer'
            onClick={() => setIsOpen(!isOpen)}
      ><MenuDots/></span>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="mt-2 min-w-max right-1 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <ul className='p-2 flex flex-col gap-1'>
          {ops?.view && (
            <li>
              <Link href={link || '#'}
                    className='flex items-center gap-2 p-3 font-normal hover:bg-gray-100 cursor-pointer rounded-md'>
                <EyeIcon/> Ver
              </Link>

            </li>
          )}
          {ops?.edit && (
            <li>
              <Link href={link || '#'}
                    className='flex items-center gap-2 p-3 font-normal hover:bg-gray-100 cursor-pointer rounded-md'>
                <PencilIcon/> Editar
              </Link>
            </li>
          )}
          {ops?.delete && (
            <li
              className='flex items-center gap-2 p-3 text-brand-600 font-semibold hover:bg-red-200 cursor-pointer rounded-md'
              onClick={onDelete}
            >
              <TrashBinIcon/> Eliminar
            </li>
          )}
          {ops?.restore && (
            <li
              className='flex items-center gap-2 p-3 text-green-700 font-semibold hover:bg-green-100 cursor-pointer rounded-md'
              onClick={onRestore}
            >
              <RestoreIcon/> Restaurar
            </li>
          )}
        </ul>
      </Dropdown>
    </div>
  );
};

export default Controls;