import ExcelJS from "exceljs";
import { getProductSnapshotById } from "../store/productSnapshotRepository";
import { calculateProfit as profit, calculateProfitPercent as profitPer, getPromedioProfitPercent } from "@/utils";

export type Product = {
  id: number | string;
  name: string;
  status: boolean;
  category_id: number | string;
  shelf_id: number | string;
  category: string;
  shelf: string;
  shelf_name?: string | null;
  quantity: number;
  type_unity: string;
  price: number;
  price_sale: number;
  product_id: number | string;
}

type ResGroupByShelf = {
  [ shelf_id: string ]: {
    shelf: { id: string; name: string };
    products: Product[];
  }
}

const groupByShelf = (products: Product[]): ResGroupByShelf => {
  const shelves = {} as ResGroupByShelf;

  for (const product of products) {
    if (!shelves[ product.shelf_id ]) {
      shelves[ product.shelf_id ] = {
        shelf: {
          id: product.shelf_id.toString(),
          name: getShelfLabel(product)
        },
        products: []
      }
    }

    shelves[ product.shelf_id ].products.push(product)
  };

  return shelves;
};

const sanitizeSheetName = (name: string, fallback: string): string => {
  const clean = name
    .replace(/[\\/:*?\[\]]/g, "")
    .trim()

  if (!clean) return fallback
  return clean.slice(0, 31)
}

const sanitizeTableName = (name: string, fallback: string): string => {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9_]/g, "_")
    .replace(/^\d+/, "")

  const alias = normalized || fallback
  return `table_${alias}`.slice(0, 255)
}

const getStatusLabel = (status: boolean): string => {
  return status ? "activo" : "inactivo"
}

const getShelfLabel = (product: Product): string => {
  const shelfFromSnapshot = product.shelf_name?.trim()
  const shelfFromProduct = product.shelf?.trim()
  const label = shelfFromSnapshot || shelfFromProduct

  if (label && label.toLowerCase() !== "estado") return label
  return `Shelf ${product.shelf_id}`
}

const generateReport = async (idReport: string, alias?: string) => {

  const { data: products, error } = await getProductSnapshotById({ id: idReport, getAll: true });

  if (error) {
    console.error("Error fetching products for report:", error);
    throw new Error(error);
  };

  try {
    const workbook = new ExcelJS.Workbook()
    const grouped = groupByShelf(products.items)

    for (const shelf_id in grouped) {

      const shelfName = grouped[ shelf_id ].shelf.name
      const worksheetName = sanitizeSheetName(`${shelf_id}_${shelfName}`, shelf_id)
      const tableName = sanitizeTableName(`${shelf_id}_${shelfName}`, shelf_id)

      const worksheet = workbook.addWorksheet(worksheetName)

      worksheet.mergeCells("A1:I1")
      const shelfHeaderCell = worksheet.getCell("A1")
      shelfHeaderCell.value = `Estanteria: ${shelfName}`
      shelfHeaderCell.font = { bold: true, size: 14 }
      shelfHeaderCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF7FAFC" }
      }
      shelfHeaderCell.alignment = { vertical: "middle", horizontal: "left" }

      worksheet.columns = [
        { header: "ID ADMIN", key: "id", width: 12 },
        { header: "Producto", key: "name", width: 50 },
        { header: "Precio de venta", key: "price", width: 15 },
        { header: "Precio de compra", key: "price_sale", width: 15 },
        { header: "Cantidad", key: "quantity", width: 10 },
        { header: "Ganancia", key: "profit", width: 15 },
        { header: "Ganancia %", key: "profitPercent", width: 15 },
        { header: "Tipo de unidad", key: "type_unity", width: 15 },
        { header: "Estado", key: "status", width: 10 },
      ]

      const totalPrice = grouped[ shelf_id ].products.reduce((sum, p) => sum + (p.price_sale * p.quantity), 0);
      const totalPriceSale = grouped[ shelf_id ].products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      const totalProducts = grouped[ shelf_id ].products.reduce((sum, p) => sum + p.quantity, 0);
      const totalProfit = grouped[ shelf_id ].products.reduce((sum, p) => sum + profit(p.price, p.price_sale, p.quantity), 0);

      worksheet.addTable({
        name: tableName,
        ref: "A3",
        headerRow: true,
        style: {
          theme: "TableStyleMedium2",
          showRowStripes: true,
          showFirstColumn: false,
          showLastColumn: false,
          showColumnStripes: false,
        },
        columns: [
          { name: "ID ADMIN" },
          { name: "Producto" },
          { name: "Precio de venta" },
          { name: "Precio de compra" },
          { name: "Cantidad" },
          { name: 'Ganancia' },
          { name: 'Ganancia %' },
          { name: "Tipo de unidad" },
          { name: "Estado" }
        ],
        rows: grouped[ shelf_id ].products.map(p => [
          p.product_id,
          p.name,
          p.price,
          p.price_sale,
          p.quantity,
          profit(p.price, p.price_sale, p.quantity),
          profitPer(p.price, p.price_sale) / 100,
          p.type_unity,
          getStatusLabel(p.status)
        ])
      })

      const headerRow = worksheet.getRow(3)
      headerRow.height = 22
      headerRow.eachCell((cell) => {
        cell.font = { ...cell.font, bold: true }
        cell.alignment = { vertical: "middle", horizontal: "center" }
      })

      const startDataRow = 4
      const endDataRow = startDataRow + grouped[ shelf_id ].products.length - 1

      for (let rowIndex = startDataRow; rowIndex <= endDataRow; rowIndex++) {
        const row = worksheet.getRow(rowIndex)

        row.getCell(3).numFmt = "$#,##0.00"
        row.getCell(4).numFmt = "$#,##0.00"
        row.getCell(6).numFmt = "$#,##0.00"
        row.getCell(7).numFmt = "0.00%"
        row.getCell(5).alignment = { horizontal: "center" }
        row.getCell(9).alignment = { horizontal: "center", vertical: "middle" }
      }

      worksheet.views = [ { state: "frozen", ySplit: 3 } ]

      const statusColumn = 9
      const statusRowStart = 4
      const activeFillColor = "FFFDE2E2"
      const inactiveFillColor = "FFE8F5E9"

      grouped[ shelf_id ].products.forEach((product, index) => {
        const rowNumber = statusRowStart + index
        const statusCell = worksheet.getRow(rowNumber).getCell(statusColumn)

        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: product.status ? activeFillColor : inactiveFillColor },
        }
      })

      const totalRow = worksheet.addRow({
        id: "TOTAL",
        name: products.count,
        price: totalPrice,
        price_sale: totalPriceSale,
        quantity: totalProducts,
        profit: totalProfit,
        profitPercent: getPromedioProfitPercent(grouped[ shelf_id ].products) / 100,
        type_unity: "",
        status: ""
      });

      totalRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE5F3FF" },
        };
        cell.font = {
          ...cell.font,
          bold: true,
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FFB8C2CC" } },
          bottom: { style: "thin", color: { argb: "FFB8C2CC" } },
        }
      });

      totalRow.getCell(3).numFmt = "$#,##0.00"
      totalRow.getCell(4).numFmt = "$#,##0.00"
      totalRow.getCell(6).numFmt = "$#,##0.00"
      totalRow.getCell(7).numFmt = "0.00%"
    }

    const fileBuffer = await workbook.xlsx.writeBuffer();

    return {
      fileName: `${alias ?? "reporte"}.xlsx`,
      fileBuffer,
    };
  } catch (error) {
    console.error("Error generating Excel report:", error);
    throw error;
  }
}

export default generateReport;