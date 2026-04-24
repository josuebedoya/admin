import {CellProps, TableProps, TBodyProps, TFootProps, THeadProps, TRowProps} from "@ui/table/types";
import React from "react";
import cn from "@utils/cn";

const Cell: React.FC<CellProps> = ({isHead = false, children, ...ui}) => {
  const CellTag = isHead ? "th" : "td";
  return <CellTag className={cn(ui.className)}>{children}</CellTag>;
};

const Table: React.FC<TableProps> = ({children, ...ui}) => {
  return <table className={cn(ui.className)}>{children}</table>;
};

const THead: React.FC<THeadProps> = ({children, ...ui}) => {
  return <thead className={cn(ui.className)}>{children}</thead>;
};

const TBody: React.FC<TBodyProps> = ({children, ...ui}) => {
  return <tbody className={cn(ui.className)}>{children}</tbody>;
};

const TFoot: React.FC<TFootProps> = ({children, ...ui}) => {
  return <tfoot className={cn(ui.className)}>{children}</tfoot>;
};

const TRow: React.FC<TRowProps> = ({children, ...ui}) => {
  return <tr className={cn(ui.className)}>{children}</tr>;
}

export {Table, THead, TBody, TFoot, Cell, TRow};