'use client';

import {fetchDailySales} from "@/server/actions/store";
import TableRestored from "@/components/wastebasket/components/tableRestored";
import {DailySale} from "@/server/store/dailySaleRepository";

interface TableDailySalesProps {
  items: DailySale[];
  totalAmount?: number;
  currentPage?: number;
  pageSize?: number;
  keyCache?: string;
}

const TableDeletedDailySales = (
  {
    items,
    currentPage = 1,
    pageSize = 10,
    keyCache,
    totalAmount
  }: TableDailySalesProps) => {

  return <TableRestored
    items={items}
    keyCache={keyCache ?? 'daily-sales-deleted'}
    fetchFn={fetchDailySales}
    module='daily-sales'
    pageSize={pageSize}
    totalAmount={totalAmount}
    currentPage={currentPage}
    isSaleTable
  />
};

export default TableDeletedDailySales;

