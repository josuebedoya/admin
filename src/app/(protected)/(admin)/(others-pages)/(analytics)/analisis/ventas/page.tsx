import React from 'react';
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import {fetchDailySalesWithQuery} from "@/server/actions/store";

export default async function SalesPage() {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  const query = {
    gte: { date_created: firstDayOfMonth.toISOString() },
    lte: { date_created: currentDate.toISOString() }
  };

  const data = await fetchDailySalesWithQuery(query);
  const sales = data?.items || [];

  return (
    <div className="space-y-6">
      <div className="col-span-12">
        <StatisticsChart sales={sales} />
      </div>
    </div>
  );
}
