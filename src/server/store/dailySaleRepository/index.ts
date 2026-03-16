import getDailySales from "./getDailySales";
import createDailySale from "./createDailySale";
import updateDailySale from "./updateDailySale";
import getById from "./getById";
import softDeleteDailySale from "./softDeleteDailySale";
import softRestoreDailySale from "./softRestoreDailySale";

export {
  getDailySales,
  getById as getDailySaleById,
  createDailySale,
  updateDailySale,
  softDeleteDailySale,
  softRestoreDailySale,
}

export type DailySale = {
  id: number | string;
  transferred: number;
  cashed: number;
  note: string | null;
  date_created: string;
  date_deleted: string | null;
}
