import {Table, TableBody, TableCell, TableHeader, TableRow,} from "../ui/table";

type TableProps = {
  data: {
    headers: string[];
    body: {
      row: any[];
    }[];
  };
};


export default function BasicTableOne({data}: TableProps) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {data?.headers?.map((h, i) => (
                  <TableCell
                    key={i}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
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
                  {b?.row?.map((c: any, j: number) => (
                    <TableCell className="px-5 py-3 sm:px-6 text-start cursor-pointer" key={j}>
                      {c}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
