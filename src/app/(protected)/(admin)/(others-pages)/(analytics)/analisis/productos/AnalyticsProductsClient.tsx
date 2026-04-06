"use client";

import React, {useCallback, useEffect, useState} from "react";
import getProducts from "@/server/store/productRepository/getProducts";
import {formattedMoney as fMat, getPromedioProfitPercent, getTotalProfit} from "@/utils";
import {DollarLineIcon, GraphicIcon, ProductsIcon} from "@/icons";
import Alert from "@/components/ui/alert/Alert";

type AnalyticsData = {
  count: number;
  totalPriceSale: number;
  totalPricePurchase: number;
  totalProfit: number;
  averageProfitPercent: number;
};

export default function AnalyticsProductsClient() {
  const [data, setData] = useState<AnalyticsData>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const {data: products, error} = await getProducts({getAll: true});
    if (error) {
      console.error("Error fetching products:", error);
      setError("Error al cargar los productos");
      setIsLoading(false);
      return;
    }

    const items = products?.items || [];
    const count = products?.count || 0;

    const totalPricePurchase = items.reduce(
      (total, p) => total + p.price * p.quantity,
      0
    );
    const totalPriceSale = items.reduce(
      (total, p) => total + p.price_sale * p.quantity,
      0
    );
    const totalProfit = getTotalProfit(items as any);
    const averageProfitPercent = getPromedioProfitPercent(items as any);

    setData({
      count,
      totalPriceSale,
      totalPricePurchase,
      totalProfit,
      averageProfitPercent,
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) {
    return (
      <Alert
        variant="error"
        title="Error"
        message="Algún error ocurrió al cargar los productos. Intenta nuevamente más tarde."
      />
    );
  }

  const cards = [
    {
      icon: <ProductsIcon className="text-brand-500"/>,
      title: "Productos",
      value: isLoading ? "..." : data?.count,
    },
    {
      icon: <DollarLineIcon className="text-green-600"/>,
      title: "Total Acumulado Precio venta",
      value: isLoading ? "..." : fMat(data?.totalPriceSale || 0),
    },
    {
      icon: <DollarLineIcon className="text-green-600"/>,
      title: "Total Acumulado Precio compra",
      value: isLoading ? "..." : fMat(data?.totalPricePurchase || 0),
    },
    {
      icon: <DollarLineIcon className="text-green-600"/>,
      title: "Ganancias Totales",
      value: isLoading ? "..." : fMat(data?.totalProfit || 0),
    },
    {
      icon: <GraphicIcon className="text-orange-500"/>,
      title: "Promedio de Ganancias %",
      value: isLoading ? "..." : `${data?.averageProfitPercent || 0}%`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            {card.icon}
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {card.title}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {card.value}
              </h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
