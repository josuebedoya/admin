"use client";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import dynamic from "next/dynamic";
import {ApexOptions} from "apexcharts";
import flatpickr from "flatpickr";
import {DailySale} from "@/server/store/dailySaleRepository";
import {formattedMoney} from "@/utils";
import {fetchDailySalesWithQuery} from "@/server/actions/store";

const Chart = dynamic(() => import("react-apexcharts"), {ssr: false});

type Params = {
  sales: DailySale[];
  onDateRangeChange?: (from: Date, to: Date) => void;
  isLoading?: boolean;
};

export default function StatisticsChart({sales: initialSales, onDateRangeChange, isLoading: initialLoading}: Params) {
  const datePickerRef = useRef<HTMLInputElement>(null);
  const [sales, setSales] = useState<DailySale[]>(initialSales);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSales(initialSales);
  }, [initialSales]);

  const handleDateRangeChange = useCallback(async (selectedDates: Date[]) => {
    if (selectedDates.length !== 2) return;

    const [from, to] = selectedDates;
    setLoading(true);

    try {
      const toEndOfDay = new Date(to);
      toEndOfDay.setHours(23, 59, 59, 999);

      const query = {
        gte: {date_created: from.toISOString()},
        lte: {date_created: toEndOfDay.toISOString()}
      };

      const data = await fetchDailySalesWithQuery(query);
      setSales(data?.items || []);
      onDateRangeChange?.(from, to);
    } catch (err) {
      console.error('Error fetching sales for date range:', err);
    } finally {
      setLoading(false);
    }
  }, [onDateRangeChange]);

  useEffect(() => {
    if (!datePickerRef.current) return;

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M d",
      defaultDate: [firstDayOfMonth, today],
      clickOpens: true,
      onChange: (selectedDates) => handleDateRangeChange(selectedDates),
      prevArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 15L7.5 10L12.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      nextArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    });

    return () => {
      if (!Array.isArray(fp)) {
        fp.destroy();
      }
    };
  }, [handleDateRangeChange]);

  const {categories, monthlyTotals, accumulatedTotals, totalSales} = useMemo(() => {
    const now = new Date();
    const monthKeys: string[] = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthKeys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    const totalsMap = monthKeys.reduce<Record<string, number>>((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});

    for (const sale of sales ?? []) {
      const saleDate = new Date(sale.date_created);
      if (Number.isNaN(saleDate.getTime())) continue;

      const saleKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, "0")}`;
      if (!(saleKey in totalsMap)) continue;

      totalsMap[saleKey] += (sale.transferred || 0) + (sale.cashed || 0);
    }

    const monthFormatter = new Intl.DateTimeFormat("es-ES", {
      month: "long",
      year: "numeric",
    });

    const monthlyTotalsArray = monthKeys.map((key) => totalsMap[key] ?? 0);
    const total = monthlyTotalsArray.reduce((sum, value) => sum + value, 0);

    // Calcular total acumulado por mes
    const accumulatedTotals = monthlyTotalsArray.reduce<number[]>((acc, value) => {
      const lastAccumulated = acc[acc.length - 1] ?? 0;
      acc.push(lastAccumulated + value);
      return acc;
    }, []);

    return {
      categories: monthKeys.map((key) => {
        const [year, month] = key.split("-").map(Number);
        return monthFormatter.format(new Date(year, month - 1, 1));
      }),
      monthlyTotals: monthlyTotalsArray,
      accumulatedTotals,
      totalSales: total,
    };
  }, [sales]);

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#10B981"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => formattedMoney(val),
      },
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
        formatter: (val: number) => formattedMoney(val),
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Ventas Mes",
      data: monthlyTotals,
    },
    {
      name: "Total acumulado",
      data: accumulatedTotals,
    },
  ];

  if (initialLoading) {
    return (
      <div
        className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 animate-pulse">
        <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
          <div className="w-full space-y-3">
            <div className="h-6 w-1/3 bg-gray-100 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-1/4 bg-gray-100 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
        <div className="h-[310px] bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between items-center">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Ventas mensuales
          </h3>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            Total de ventas: <span
            className="font-semibold text-gray-800 dark:text-white">{formattedMoney(totalSales)}</span>
          </p>
        </div>

        <div className="w-full sm:w-1/3">
          <div className="relative">
            <input
              ref={datePickerRef}
              type="text"
              placeholder="Rango de fechas"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
            />
            <span
              className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round"/>
                </svg>
              </span>
          </div>
        </div>
      </div>

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="min-w-[1000px] xl:min-w-full relative">
          {loading && (
            <div
              className="absolute inset-0 bg-white/50 dark:bg-white/5 z-20 flex items-center justify-center rounded-lg">
              <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                   viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
          <Chart options={options} series={series} type="area" height={310}/>
        </div>
      </div>
    </div>
  );
}
