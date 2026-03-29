import {cookies} from "next/headers";

type SearchParams = {[key: string]: string | string[] | undefined};

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_COOKIE_KEY = "table-page-size";

const toPositiveInt = (value: string | undefined) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const firstValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

export async function getPageSizeFromParams(params: SearchParams): Promise<number> {
  const pageSizeFromQuery = toPositiveInt(firstValue(params.pageSize));
  if (pageSizeFromQuery) {
    return pageSizeFromQuery;
  }

  const cookieStore = await cookies();
  const pageSizeFromCookie = toPositiveInt(cookieStore.get(PAGE_SIZE_COOKIE_KEY)?.value);
  if (pageSizeFromCookie) {
    return pageSizeFromCookie;
  }

  return DEFAULT_PAGE_SIZE;
}
