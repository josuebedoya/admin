import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../ui/table";

type TableProps = {
  data: {
    headers: string[];
    body: {
      row: any[];
    }[];
  };
    stickyLastRow?: boolean;
};


export default function BasicTableOne({ data, stickyLastRow }: TableProps) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px] overflow-y-auto max-h-[85vh] scrollbar-primary">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow className="rounded-lg overflow-hidden bg-brand-500  rounded-tr-lg rounded-tl-lg">
                {data?.headers?.map((h, i) => (
                  <TableCell
                    key={i}
                    isHeader
                    className="px-5 py-5 font-medium text-brand-600  text-start text-theme-xs sticky top-0 z-10 bg-brand-100"
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data?.body?.map((b, i) => (
                <TableRow key={i} className='hover:bg-gray-100 duration-150 transition-all'>
                  {b?.row?.map((c: any, j: number) => {
                    const isLastRow = i === data.body.length - 1;
                    return (
                      <TableCell className={`px-3 py-3 sm:px-6 text-start cursor-pointer ${isLastRow && stickyLastRow ? 'sticky bottom-0 z-10 bg-brand-50 !text-gray-dark ' : ''}`} key={j}>
                        {c}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
