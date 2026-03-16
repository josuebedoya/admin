import getById from "./getById";
import getReports from "./getReports";
import createReport from "./createReport";
import updateReport from "./updateReport";
import softDeleteReport from "./softDeleteReport";
import softRestoreReport from "./softRestoreReport";

export {
  getReports,
  getById as getReportById,
  createReport,
  updateReport,
  softDeleteReport,
  softRestoreReport,
}

export type Report = {
  id: number | string;
  name: string;
  date_created: string;
  date_deleted: string | null;
}