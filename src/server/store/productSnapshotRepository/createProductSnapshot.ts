import supabase from "@/server/client";
import ResApi from "@/server/resApi";
import { createParams } from "@/server/services/create";
import { getProducts } from "../productRepository";

type ResCreateProductSnapshot = {
  data: { items: any[] };
  error: string | null;
  success: boolean;
  message: string;
}

const createProductSnapshot = async ({ data }: createParams): Promise<ResCreateProductSnapshot> => {
  const reportId = (data as any).report_id;

  if (!reportId) {
    return ResApi({
      data: { items: [] },
      success: false,
      message: 'REPORT_ID_REQUIRED',
      error: 'report_id is required to create a product snapshot',
      status: 400
    });
  }

  // Fetch only active, non-deleted products
  const { data: allProductsData, error: productsError } = await getProducts({
    getAll: true,
    orderBy: 'id',
    ascending: true,
    eq: {status: true}
  });

  if (productsError) {
    return ResApi({
      data: { items: [] },
      success: false,
      message: 'GET_PRODUCTS_FAILED',
      error: productsError,
      status: 400
    });
  }

  const products = allProductsData?.items ?? [];

  if (products.length === 0) {
    return ResApi({
      data: { items: [] },
      success: true,
      message: 'NO_PRODUCTS_TO_SNAPSHOT',
      error: null,
      status: 200
    });
  }

  // Map products to product_snapshot rows
  const snapshots = products.map((p) => ({
    report_id: reportId,
    product_id: p.id,
    name: p.name,
    category_name: p.category ?? null,
    price: p.price,
    price_sale: p.price_sale,
    category_id: p.category_id,
    shelf_name: p.shelf ?? null,
    shelf_id: p.shelf_id,
    quantity: p.quantity,
    type_unity: p.type_unity,
    status: p.status,
    date_deleted: p.date_deleted ?? null
  }));

  // insert snapshots into product_snapshot table
  const { data: inserted, error: insertError } = await supabase
    .from('product_snapshot')
    .insert(snapshots)
    .select();

  if (insertError) {
    return ResApi({
      data: { items: [] },
      success: false,
      message: insertError.code || 'CREATE_SNAPSHOT_FAILED',
      error: insertError.message,
      status: 400
    });
  }

  return ResApi({
    data: { items: inserted ?? [] },
    success: true,
    message: 'CREATE_SNAPSHOT_SUCCESS',
    error: null,
    status: 201
  });
};

export default createProductSnapshot;
