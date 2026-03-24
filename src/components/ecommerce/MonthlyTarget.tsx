"use client";
// import Chart from "react-apexcharts";
import {ApexOptions} from "apexcharts";
import dynamic from "next/dynamic";
import {useMemo} from "react";
import {formattedMoney} from "@/utils";
import {TargetIcon} from "@/icons";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type MonthlyTargetProps = {
  currentMonthSales: number;
  previousMonthSales: number;
  target: number;
  todaySales: number;
  isLoading?: boolean;
};

export default function MonthlyTarget(
  {
    currentMonthSales,
    previousMonthSales,
    target,
    todaySales,
    isLoading
  }: MonthlyTargetProps) {
  const {progressPercentage, comparisonPercentage, isPositive} = useMemo(() => {
    const progress = target > 0 ? (currentMonthSales / target) * 100 : 0;
    const comparison = previousMonthSales > 0 ? ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100 : 0;
    return {
      progressPercentage: Math.min(progress, 100), // Cap at 100%
      comparisonPercentage: Math.abs(comparison),
      isPositive: comparison >= 0
    };
  }, [currentMonthSales, previousMonthSales, target]);

  const series = useMemo(() => [progressPercentage], [progressPercentage]);
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return Math.round(val) + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      {isLoading ? (
        <div
          className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6 animate-pulse">
          <div className="flex justify-between">
            <div>
              <div className="h-6 w-1/3 bg-gray-100 dark:bg-gray-800 rounded mb-2"></div>
              <div className="h-4 w-1/4 bg-gray-100 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
          <div className="relative mt-5">
            <div className="h-[330px] bg-gray-100 dark:bg-gray-800 rounded"></div>
          </div>
          <div className="h-4 w-3/4 mx-auto mt-10 bg-gray-100 dark:bg-gray-800 rounded"></div>
        </div>
      ) : (
        <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Ventas Mensuales
              </h3>
              <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
                Rendimientos de este mes
              </p>
            </div>
          </div>
          <div className="relative ">
            <div className="max-h-[330px]">
              <ReactApexChart
                options={options}
                series={series}
                type="radialBar"
                height={330}
              />
            </div>

            <span
              className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium ${isPositive ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500' : 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'}`}>
              {isPositive ? '+' : '-'}{Math.round(comparisonPercentage)}%
            </span>
          </div>
          <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
            Este mes obtienes una ganancia de <strong>{formattedMoney(currentMonthSales)}</strong> lo genera
            un <strong>{isPositive ? '+' : ''}{Math.round(comparisonPercentage)}%</strong> {isPositive ? 'más' : 'menos'} que
            el
            mes anterior.
            <br/> {isPositive ? 'Buen trabajo!' : 'Podemos mejorar.'}
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Objetivo
          </p>
          <p
            className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {formattedMoney(target)}
            <span className='text-[12px] text-orange-500'>
            <TargetIcon/>
            </span>
          </p>
        </div>

        <div className="max-md:hidden w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Ganancias
          </p>
          <p
            className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {formattedMoney(currentMonthSales)}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                fill="#039855"
              />
            </svg>
          </p>
        </div>

        <div className="max-md:hidden w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Hoy
          </p>
          <p
            className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {formattedMoney(todaySales)}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                fill="#039855"
              />
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
}
