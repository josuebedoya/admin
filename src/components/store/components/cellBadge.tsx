import React from 'react';
import Badge from "@/components/ui/badge/Badge";
import Controls, {ControlsProps} from "@/components/store/components/controls";

type CellBadgeProps = {
  isActive: boolean;
  isLast?: boolean;
  controls?: ControlsProps
}


const CellBadge = ({isActive, isLast, controls}: CellBadgeProps) => {
  return (
    <div className='flex items-center justify-between gap-2'>
      <Badge size="md" color={isActive ? 'success' : 'error'}>
        {isActive ? 'Activo' : 'Inactivo'}
      </Badge>
      {isLast && <Controls {...controls}/>}
    </div>
  );
};

export default CellBadge;