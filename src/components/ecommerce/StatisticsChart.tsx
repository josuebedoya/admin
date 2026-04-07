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

    // Guardar selección en localStorage
    localStorage.setItem('statisticsChartDateRange', JSON.stringify({
      from: from.toISOString(),
      to: to.toISOString()
    }));

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

    let defaultDates: [Date, Date];
    const savedRange = localStorage.getItem('statisticsChartDateRange');

    if (savedRange) {
      try {
        const parsed = JSON.parse(savedRange);
        defaultDates = [new Date(parsed.from), new Date(parsed.to)];
      } catch (e) {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        defaultDates = [firstDayOfMonth, today];
      }
    } else {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      defaultDates = [firstDayOfMonth, today];
    }

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M d",
      defaultDate: defaultDates,
      clickOpens: true,
      onChange: (selectedDates) => handleDateRangeChange(selectedDates),
      prevArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 15L7.5 10L12.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      nextArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    });

    if (savedRange) {
      handleDateRangeChange(defaultDates);
    }

    return () => {
      if (!Array.isArray(fp)) {
        fp.destroy();
      }
    };
  }, [handleDateRangeChange]);

  const {categories, dailyTotals, totalSales, averagePerDay, maxSale, minSale} = useMemo(() => {
    if (!sales || sales.length === 0) {
      return {
        categories: [],
        dailyTotals: [],
        totalSales: 0,
        averagePerDay: 0,
        maxSale: {value: 0, date: "-"},
        minSale: {value: 0, date: "-"}
      };
    }

    const dates = sales.map(s => {
      const d = new Date(s.date_created);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }).filter(t => !Number.isNaN(t));

    if (dates.length === 0) {
      return {
        categories: [],
        dailyTotals: [],
        totalSales: 0,
        averagePerDay: 0,
        maxSale: {value: 0, date: "-"},
        minSale: {value: 0, date: "-"}
      };
    }

    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const dayKeys: string[] = [];
    const totalsMap: Record<string, number> = {};

    // Rellenamos días vacíos para asegurar el trazo de la gráfica continuo
    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      dayKeys.push(key);
      totalsMap[key] = 0;
    }

    for (const sale of sales) {
      const saleDate = new Date(sale.date_created);
      if (Number.isNaN(saleDate.getTime())) continue;

      const key = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, "0")}-${String(saleDate.getDate()).padStart(2, "0")}`;
      if (totalsMap[key] !== undefined) {
        totalsMap[key] += (sale.transferred || 0) + (sale.cashed || 0);
      }
    }

    const dateFormatter = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short"
    });

    const dailyTotalsArray = dayKeys.map((key) => totalsMap[key] ?? 0);
    const total = dailyTotalsArray.reduce((sum, value) => sum + value, 0);
    const average = dayKeys.length > 0 ? total / dayKeys.length : 0;

    let maxSale = {value: 0, date: "-"};
    let minSale = {value: 0, date: "-"};

    if (dailyTotalsArray.length > 0) {
      maxSale.value = Math.max(...dailyTotalsArray);
      minSale.value = Math.min(...dailyTotalsArray);

      const maxIdx = dailyTotalsArray.indexOf(maxSale.value);
      const minIdx = dailyTotalsArray.indexOf(minSale.value);

      const [mxYear, mxMonth, mxDay] = dayKeys[maxIdx].split("-").map(Number);
      maxSale.date = dateFormatter.format(new Date(mxYear, mxMonth - 1, mxDay));

      const [mnYear, mnMonth, mnDay] = dayKeys[minIdx].split("-").map(Number);
      minSale.date = dateFormatter.format(new Date(mnYear, mnMonth - 1, mnDay));
    }

    return {
      categories: dayKeys.map((key) => {
        const [year, month, day] = key.split("-").map(Number);
        return dateFormatter.format(new Date(year, month - 1, day));
      }),
      dailyTotals: dailyTotalsArray,
      totalSales: total,
      averagePerDay: average,
      maxSale,
      minSale,
    };
  }, [sales]);

  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: ["#3B82F6"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: [2],
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
        }
      },
      strokeDashArray: 3,
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
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        }
      }
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
      name: "Ventas Día",
      data: dailyTotals,
    }
  ];

  if (initialLoading) {
    return (
      <div
        className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 animate-pulse">
        <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
          <div className="w-full space-y-3">
            <div className="h-6 w-1/3 bg-gray-100 dark:bg-gray-800 rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 w-full">
              <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
              <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
              <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
              <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
            </div>
          </div>
        </div>
        <div className="h-[310px] bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between items-start sm:items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Reporte de ventas por rango
          </h3>
        </div>

        <div className="w-full sm:w-1/3 shrink-0">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div
          className="flex flex-col bg-white dark:bg-gray-900/50 rounded-xl px-5 py-4 border border-gray-200 dark:border-white/10 shadow-sm transition-all hover:shadow-md">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total vendido</span>
          <span className="font-bold text-gray-800 dark:text-white text-2xl">{formattedMoney(totalSales)}</span>
        </div>
        <div
          className="flex flex-col bg-white dark:bg-gray-900/50 rounded-xl px-5 py-4 border border-gray-200 dark:border-white/10 shadow-sm transition-all hover:shadow-md">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Promedio diario</span>
          <span className="font-bold text-brand-500 text-2xl">{formattedMoney(averagePerDay)}</span>
        </div>
        <div
          className="flex flex-col bg-white dark:bg-gray-900/50 rounded-xl px-5 py-4 border border-gray-200 dark:border-white/10 shadow-sm transition-all hover:shadow-md">
          <span
            className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Mayor venta ({maxSale.date})</span>
          <span className="font-bold text-success-500 text-2xl">{formattedMoney(maxSale.value)}</span>
        </div>
        <div
          className="flex flex-col bg-white dark:bg-gray-900/50 rounded-xl px-5 py-4 border border-gray-200 dark:border-white/10 shadow-sm transition-all hover:shadow-md">
          <span
            className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Menor venta ({minSale.date})</span>
          <span className="font-bold text-error-500 text-2xl">{formattedMoney(minSale.value)}</span>
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
