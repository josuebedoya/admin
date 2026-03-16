'use client';

import {fetchShelves} from "@/server/actions/store";
import TableRestored from "@/components/wastebasket/components/tableRestored";
import {Shelve} from "@/server/store/shelveRepository";

interface TableShelvesProps {
  items: Shelve[];
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
  }: TableShelvesProps) => {

  return <TableRestored
    items={items}
    keyCache={keyCache ?? 'shelves-deleted'}
    fetchFn={fetchShelves}
    module='shelves'
    pageSize={pageSize}
    totalAmount={totalAmount}
    currentPage={currentPage}
  />
};

export default TableDeletedCategories;