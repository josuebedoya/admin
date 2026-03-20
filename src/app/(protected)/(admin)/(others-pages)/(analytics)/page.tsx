"use client";
import {EcommerceMetrics} from "@/components/ecommerce/EcommerceMetrics";
import React, {useEffect, useState} from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import {fetchDailySalesWithQuery, fetchProducts, fetchProductsTotalPrice} from "@/server/actions/store";
import {DailySale} from "@/server/store/dailySaleRepository";

export default function Analytics() {
  const [salesYear, setSalesYear] = useState<DailySale[]>([]);
  const [salesWeek, setSalesWeek] = useState<DailySale[]>([]);

  const [metrics, setMetrics] = useState({
    productsCount: 0,
    salesCount: 0,
    totalSalesAmount: 0
  });

  const [monthlyTargetData, setMonthlyTargetData] = useState({
    currentMonthSales: 0,
    previousMonthSales: 0,
    target: 0,
    todaySales: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const year = new Date().getFullYear();
        const month = new Date().getMonth();

        // 3. Query last year sales (for StatisticsChart) - This covers all other ranges
        const queryLastYear = {
          gte: {date_created: new Date(year - 1, month, 1).toISOString()},
          lt: {date_created: new Date(year, month + 1, 1).toISOString()}
        }

        const [productsRes, yearRes, productsTotalPriceRes] = await Promise.all([
          fetchProducts(1, 1, undefined, undefined, undefined, true, false, true),
          fetchDailySalesWithQuery(queryLastYear),
          fetchProductsTotalPrice(),
        ]);

        const allSales = yearRes?.items || [];

        // Helper to filter and sum
        const getSalesInInterval = (startDate: Date, endDate: Date) => {
          return allSales.filter(sale => {
            const date = new Date(sale.date_created);
            return date >= startDate && date < endDate;
          });
        };

        const sumSales = (items: DailySale[]) => items.reduce((acc, item) => acc + (item.transferred || 0) + (item.cashed || 0), 0);

        // Define ranges
        const startOfCurrentMonth = new Date(year, month, 1);
        const endOfCurrentMonth = new Date(year, month + 1, 1);

        const startOfPrevMonth = new Date(year, month - 1, 1);
        const endOfPrevMonth = new Date(year, month, 1);

        const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));
        const endOfToday = new Date(new Date().setHours(24, 0, 0, 0));

        const startOfWeek = new Date(new Date().setDate(new Date().getDate() - 7));
        const endOfWeek = new Date(); // now

        // Get items
        const currentMonthItems = getSalesInInterval(startOfCurrentMonth, endOfCurrentMonth);
        const prevMonthItems = getSalesInInterval(startOfPrevMonth, endOfPrevMonth);
        const weekItems = getSalesInInterval(startOfWeek, endOfWeek);
        const todayItems = getSalesInInterval(startOfToday, endOfToday);

        // Calculate metrics
        setMetrics({
          productsCount: productsRes?.count || 0,
          salesCount: currentMonthItems.length,
          totalSalesAmount: sumSales(currentMonthItems)
        });

        setSalesWeek(weekItems);
        setSalesYear(allSales);

        // Calculate values for MonthlyTarget
        const currentMonthSales = sumSales(currentMonthItems);
        const previousMonthSales = sumSales(prevMonthItems);
        const target = productsTotalPriceRes;
        const todaySales = sumSales(todayItems);

        setMonthlyTargetData({
          currentMonthSales,
          previousMonthSales,
          target,
          todaySales
        });

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

  console.log(monthlyTargetData.previousMonthSales, monthlyTargetData.currentMonthSales)

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
        <MonthlyTarget
          currentMonthSales={monthlyTargetData.currentMonthSales}
          previousMonthSales={monthlyTargetData.previousMonthSales}
          target={monthlyTargetData.target}
          todaySales={monthlyTargetData.todaySales}
          isLoading={loading}
        />
      </div>

      <div className="col-span-12">
        <StatisticsChart sales={salesYear} isLoading={loading}/>
      </div>
    </div>
  );
}
