import React from 'react';
import Link from "next/link";
import Controls, {ControlsProps} from "@/components/store/components/controls";

interface CellProps {
  text?: string | number | null;
  path?: string;
  withLink?: boolean;
  isLast?: boolean;
  controls?: ControlsProps;
}

const Cell = ({text, path, withLink, isLast, controls}: CellProps) => {
  const classes = `py-3 text-gray-500 text-[13px] dark:text-gray-400 hover:text-brand-600 ${controls ? 'pr-2' : ''} uppercase`;

  return (
    <div className='flex items-center justify-between gap-2'>
      {withLink ? (
        <Link href={path ?? '/public'}>
          <span className={classes}>{text}</span>
        </Link>
      ) : (<span className={classes}>{text}</span>)}
      {isLast && <Controls {...controls}/>}
    </div>
  )
};

export default Cell;