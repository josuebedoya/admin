'use client';

import {fetchReports} from "@/server/actions/store";
import TableRestored from "@/components/wastebasket/components/tableRestored";
import {Report} from "@/server/store/reportsRepository";

interface TableReportsProps {
  items: Report[];
  totalAmount?: number;
  currentPage?: number;
  pageSize?: number;
  keyCache?: string;
}

const TableDeletedReports = (
  {
    items,
    currentPage = 1,
    pageSize = 10,
    keyCache,
    totalAmount
  }: TableReportsProps) => {

  return <TableRestored
    items={items}
    keyCache={keyCache ?? 'reports-deleted'}
    fetchFn={fetchReports}
    module='reports'
    pageSize={pageSize}
    totalAmount={totalAmount}
    currentPage={currentPage}
    isSaleTable
  />
};

export default TableDeletedReports;

