"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import {ArrowUpIcon, DollarLineIcon, ProductsIcon} from "@/icons";
import {formattedMoney} from "@/utils";

type Params = {
  productsCount: number;
  salesCount: number;
  totalSalesAmount: number;
  isLoading?: boolean;
}

export const EcommerceMetrics = ({productsCount, salesCount, totalSalesAmount, isLoading}: Params) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 mb-4"></div>
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <ProductsIcon className="text-gray-800 size-6 dark:text-white/90"/>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Productos
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {productsCount}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon/>
            11.01%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <DollarLineIcon className="text-gray-800 dark:text-white/90"/>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Ventas Mensuales
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {salesCount}
            </h4>
          </div>

          <Badge color="success">
            <DollarLineIcon className="text-green-500"/>
            {formattedMoney(totalSalesAmount || 0)}
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
