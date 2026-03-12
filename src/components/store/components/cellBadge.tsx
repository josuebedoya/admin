import React from 'react';
import Badge from "@/components/ui/badge/Badge";
import {MenuDots} from "@/icons";

type CellBadgeProps = {
  isActive: boolean;
  isLast?: boolean;
}

const controls = <span className='p-1 hover:bg-gray-300 rounded-sm svg-img-options'><MenuDots/></span>;

const CellBadge = ({isActive, isLast}: CellBadgeProps) => {
  return (
    <div className='flex items-center justify-between gap-2'>
      <Badge size="md" color={isActive ? 'success' : 'error'}>
        {isActive ? 'Activo' : 'Inactivo'}
      </Badge>
      {isLast && controls}
    </div>
  );
};

export default CellBadge;