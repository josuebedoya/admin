import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import {dictionary} from "@/dictionary";
import TableSales from "@/components/store/tableSales";
import getDailySales from "@/server/store/getDailySales";

export const metadata: Metadata = {
  title: "Ventas Diarias - Admin",
  description:
    "Gestione las ventas diarias y vea los detalles de cada venta en el panel de administración.",
};

const {data: products, error, message} = await getDailySales();
console.log(message)

export default function Sales() {
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
            <TableSales items={products.items || []}/>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
