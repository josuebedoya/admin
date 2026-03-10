import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import {dictionary} from "@/dictionary";
import TableSales from "@/components/store/tableSales";
import getDailySales from "@/server/store/dailySaleRepository/getDailySales";

export const metadata: Metadata = {
  title: "Ventas Diarias - Admin",
  description:
    "Gestione las ventas diarias y vea los detalles de cada venta en el panel de administración.",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Sales({searchParams}: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;

  const {data: dailySales, error, message} = await getDailySales({page, pageSize});

  return (
    <div>
      <PageBreadcrumb pageTitle={dictionary.admin.dashboard.sales.title}/>
      <div className="space-y-6">
        <ComponentCard title={dictionary.admin.dashboard.sales.description}>
          {error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              {dictionary.msg[message as keyof typeof dictionary.msg] || 'Error al cargar las ventas diarias'}
            </div>
          ) : (
            <TableSales
              items={dailySales.items || []}
              totalAmount={dailySales.count || 0}
              currentPage={page}
              pageSize={pageSize}
            />
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
