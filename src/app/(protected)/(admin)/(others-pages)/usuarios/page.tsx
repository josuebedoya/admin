import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import {dictionary} from "@/dictionary";
import TableUsers from "@/components/auth/tableUsers";
import getUsers from "@/server/auth/getUsers";
import {requireAdmin} from "@/server/auth/requireAdmin";
import {getPageSizeFromParams} from "@/server/utils/getPageSizeFromParams";

export const metadata: Metadata = {
  title: "Usuarios - Admin",
  description:
    "Administra los usuarios, y sus roles para la administración",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Users({searchParams}: PageProps) {
  await requireAdmin();

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = await getPageSizeFromParams(params);

  const {data: users, error, message} = await getUsers({page, pageSize});

  return (
    <div>
      <PageBreadcrumb pageTitle={dictionary.admin.users.title}/>
      <div className="space-y-6">
        <ComponentCard title={dictionary.admin.users.description}>
          {error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              {dictionary.msg[message as keyof typeof dictionary.msg] || 'Error al cargar los Usuarios'}
            </div>
          ) : (
            <TableUsers
              items={users.items || []}
              totalAmount={users.count || 0}
              currentPage={page}
              pageSize={pageSize}
            />
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
