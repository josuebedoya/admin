import React from "react";

type Common = {
  className?: string;
  children?: React.ReactNode;
}

export type CellProps = {
  isHead?: boolean;
} & Common;

export type TableProps = Common;

export type THeadProps = Common;

export type TBodyProps = Common;

export type TFootProps = Common;

export type TRowProps = Common;