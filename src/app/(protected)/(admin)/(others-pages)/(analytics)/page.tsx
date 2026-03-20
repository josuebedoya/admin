"use client";
import {EcommerceMetrics} from "@/components/ecommerce/EcommerceMetrics";
import React, {useEffect, useState} from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import {fetchDailySalesWithQuery, fetchProducts} from "@/server/actions/store";
import {DailySale} from "@/server/store/dailySaleRepository";

export default function Analytics() {
  const [salesYear, setSalesYear] = useState<DailySale[]>([]);
  const [salesWeek, setSalesWeek] = useState<DailySale[]>([]);

  const [metrics, setMetrics] = useState({
    productsCount: 0,
    salesCount: 0,
    totalSalesAmount: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const year = new Date().getFullYear();
        const month = new Date().getMonth();

        // 1. Query current month sales (for metrics)
        const queryMonthly = {
          gte: {date_created: new Date(year, month, 1).toISOString()},
          lt: {date_created: new Date(year, month + 1, 1).toISOString()}
        }

        // 2. Query back seven days sales (for MonthlySalesChart)
        const queryBackSevenDays = {
          gte: {date_created: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()},
          lt: {date_created: new Date().toISOString()}
        }

        // 3. Query last year sales (for StatisticsChart)
        const queryLastYear = {
          gte: {date_created: new Date(year - 1, month, 1).toISOString()},
          lt: {date_created: new Date(year, month + 1, 1).toISOString()}
        }

        const [productsRes, monthlyRes, weekRes, yearRes] = await Promise.all([
          fetchProducts(1, 1, undefined, undefined, undefined, true, false, true),
          fetchDailySalesWithQuery(queryMonthly),
          fetchDailySalesWithQuery(queryBackSevenDays),
          fetchDailySalesWithQuery(queryLastYear),
        ]);

        setMetrics({
          productsCount: productsRes?.count || 0,
          salesCount: monthlyRes?.count || 0,
          totalSalesAmount: monthlyRes?.total_sales?.total_current_month || 0
        });

        setSalesWeek(weekRes?.items || []);
        setSalesYear(yearRes?.items || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
        console.error('Error fetching sales:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics
          isLoading={loading}
          productsCount={metrics.productsCount}
          salesCount={metrics.salesCount}
          totalSalesAmount={metrics.totalSalesAmount}/>

        <MonthlySalesChart sales={salesWeek} isLoading={loading}/>
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget/>
      </div>

      <div className="col-span-12">
        <StatisticsChart sales={salesYear} isLoading={loading}/>
      </div>
    </div>
  );
}
