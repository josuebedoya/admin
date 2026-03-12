import React from 'react';
import Link from "next/link";
import {MenuDots} from "@/icons";

interface CellProps {
  text: string | number;
  path?: string;
  withLink?: boolean;
  isLast?: boolean;
}

const controls = <span className='p-1 hover:bg-gray-300 rounded-sm svg-img-options'><MenuDots/></span>;
const classes = `py-3 text-gray-500 text-[13px] dark:text-gray-400 hover:text-brand-600 ${controls ? 'pr-2' : ''} uppercase`;

const Cell = ({text, path, withLink, isLast}: CellProps) => {
  return (
    <div className='flex items-center justify-between gap-2'>
      {withLink ? (
        <Link href={path ?? '/public'}>
          <span className={classes}>{text}</span>
        </Link>
      ) : (<span className={classes}>{text}</span>)}
      {isLast && controls}
    </div>
  )
};

export default Cell;