import Button from "@/components/ui/button/Button";
import { DownloadIcon, } from "@/icons";
import generateReport from "@/server/actions/excel";

type ButtonDownloadReportProps = {
  nameReport?: string;
  id: string;
};

const ButtonDownloadReport = ({ nameReport, id }: ButtonDownloadReportProps) => {

  const downloadReport = async () => {
    const report = await generateReport(id, nameReport);
    if (!report) return;

    const blob = new Blob([ report.fileBuffer ], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = report.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex justify-center items-center relative">
      <Button
        variant="outline"
        onClick={downloadReport}
        className="flex justify-center items-center p-3!"
        title="Descargar Reporte"
      >
        <DownloadIcon />
      </Button>
    </div>
  )
}

export default ButtonDownloadReport;
