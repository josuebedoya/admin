'use client';

import {fetchCategories} from "@/server/actions/store";
import {Category} from "@/server/store/categoryRepository";
import TableRestored from "@/components/wastebasket/components/tableRestored";

interface TableProductsProps {
  items: Category[];
  totalAmount?: number;
  currentPage?: number;
  pageSize?: number;
  keyCache?: string;
}

const TableDeletedCategories = (
  {
    items,
    currentPage = 1,
    pageSize = 10,
    keyCache,
    totalAmount
  }: TableProductsProps) => {

  return <TableRestored
    items={items}
    keyCache={keyCache ?? 'categories-deleted'}
    fetchFn={fetchCategories}
    module='categories'
    pageSize={pageSize}
    totalAmount={totalAmount}
    currentPage={currentPage}
  />
};

export default TableDeletedCategories;