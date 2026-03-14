'use client';

import {useCallback} from 'react';
import TableProducts from '@/components/store/tableProducts';
import {fetchProductSnapshotsByReportId} from '@/server/actions/store';

type ReportProductsTableProps = {
  reportId: string | number;
  items: {
    id: string | number;
    name: string;
    status: boolean;
    category: string;
    quantity: number;
    price: number;
    price_sale: number;
    type_unity: string;
    category_id: string | number;
    shelf: string;
    shelf_id: string | number;
  }[];
  totalAmount?: number;
  currentPage?: number;
  pageSize?: number;
  keyCache?: string;
};

export default function ReportProductsTable({
  reportId,
  items,
  totalAmount = 0,
  currentPage = 1,
  pageSize = 10,
  keyCache,
}: ReportProductsTableProps) {
  const fetchFn = useCallback(async (
    page: number,
    size: number,
    orderBy?: string,
    ascending?: boolean,
    search?: string,
  ) => {
    return await fetchProductSnapshotsByReportId(reportId, page, size, orderBy, ascending, search);
  }, [reportId]);

  return (
    <TableProducts
      items={items}
      totalAmount={totalAmount}
      currentPage={currentPage}
      pageSize={pageSize}
      readonly
      isDashboard
      showAll
      keyCache={keyCache}
      fetchFn={fetchFn}
      button={{
        label: 'Volver',
        onActionButton: 'back',
        position: 'left',
      }}
    />
  );
}
