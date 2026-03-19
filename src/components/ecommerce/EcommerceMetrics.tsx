"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import {ArrowUpIcon, DollarLineIcon, ProductsIcon} from "@/icons";
import {formattedMoney} from "@/utils";

type Params = {
  productsCount: number;
  salesCount?: number;
  totalSalesAmount?: number;
}


export const EcommerceMetrics = ({productsCount, salesCount, totalSalesAmount}: Params) => {
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
