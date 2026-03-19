"use client";
import {ApexOptions} from "apexcharts";
import dynamic from "next/dynamic";
import {formattedDate, formattedMoney, getArrayBackDays, slugify} from "@/utils";
import {DailySale} from "@/server/store/dailySaleRepository";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});


type Params = {
  sales: DailySale[]
}
export default function MonthlySalesChart({sales}: Params) {
  const backWeekend = getArrayBackDays(7)
  const backWeekendDays = backWeekend.map(date => formattedDate(date, "long", ['day']))?.reverse();

  const options: ApexOptions = {
    colors: ["#3B82F6"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 250,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: backWeekendDays,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => formattedMoney(val),
      },
    },
  };

  type DayKey =
    | 'lunes'
    | 'martes'
    | 'miercoles'
    | 'jueves'
    | 'viernes'
    | 'sabado'
    | 'domingo';

  const dayKeys: DayKey[] = backWeekendDays.map(d => slugify(d) as DayKey);

  const groupedSales = sales.reduce<Record<DayKey, number>>(
    (acc, sale) => {
      const daySale = formattedDate(sale.date_created, "long", ["day"]);
      const normalizedDay = slugify(daySale) as DayKey;
      const totalSale = sale.transferred + sale.cashed;

      if (dayKeys.includes(normalizedDay)) {
        acc[normalizedDay] += totalSale;
      }

      return acc;
    },
    {
      lunes: 0,
      martes: 0,
      miercoles: 0,
      jueves: 0,
      viernes: 0,
      sabado: 0,
      domingo: 0,
    }
  );

  const series: { name: string; data: number[] }[] = [
    {
      name: "Venta",
      data: dayKeys.map(d => groupedSales[d]),
    },
  ];

  return (
    <div
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Ventas Semanales
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={180}
          />
        </div>
      </div>
    </div>
  );
}
