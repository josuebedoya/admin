import type {Metadata} from "next";
import {EcommerceMetrics} from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import getProducts from "@/server/store/productRepository/getProducts";
import {getDailySales} from "@/server/store/dailySaleRepository";

export const metadata: Metadata = {
  title:
    "Análisis de ventas y rendimiento - Admin",
  description: "Analiza las ventas, el rendimiento y las tendencias de tu tienda en línea con nuestras herramientas de análisis avanzadas. Visualiza gráficos detallados, estadísticas clave y datos demográficos para tomar decisiones informadas y optimizar tu estrategia de comercio electrónico.",
};

export default async function Analytics() {

  const year = new Date().getFullYear();
  const month = new Date().getMonth();

  // build filter to get sales for the current month
  const queryMonthly = {
    gte: {date_created: new Date(year, month, 1).toISOString()},
    lt: {date_created: new Date(year, month + 1, 1).toISOString()}
  }

  // Filter to get back seven days sales
  const queryBackSevenDays = {
    gte: {date_created: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()},
    lt: {date_created: new Date().toISOString()}
  }

  // Get count products in the store
  const {data: products, error: errorProducts, message: messageProducts} = await getProducts({
    getAll: true,
    onlyCount: true,
  });

  // Get count of current moth sales
  const {data: sales, error: errorSales, message: messageSales} = await getDailySales(
    {getAll: true, onlyCount: true, ...queryMonthly});

  // Get sales for the last seven days to show in the chart
  const {data: salesWeek, error: errorSalesWeek, message: messageSalesWeek} = await getDailySales(
    {...queryBackSevenDays});

  if (errorProducts || errorSales || errorSalesWeek) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        {(messageProducts || messageSales || messageSalesWeek) || 'Error al cargar los datos de análisis'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics
          productsCount={products.count} salesCount={sales.count}
          totalSalesAmount={sales.total_sales.total_current_month}/>

        <MonthlySalesChart sales={salesWeek.items}/>
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget/>
      </div>

      <div className="col-span-12">
        <StatisticsChart/>
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard/>
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders/>
      </div>
    </div>
  );
}
