import Button from "@/components/ui/button/Button";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { dictionary } from "@/dictionary";
import { PageIcon } from "@/icons";
import { useState } from "react";
import Loader from '@/icons/loader.svg';
import Alert from "@/components/ui/alert/Alert";

type ButtonReportProps = {
  onGenerate: (name: string) => Promise<{
    data: any;
    error: string | null;
    success: boolean;
    message: string;
  }>;
};

const ButtonReport = ({ onGenerate }: ButtonReportProps) => {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ nameReport, setNameReport ] = useState("");
  const [ isLoading, setIsLoading ] = useState(false);
  const [ messageError, setMessageError ] = useState("");
  const [ successMessage, setSuccessMessage ] = useState("");
  const [ finished, setFinished ] = useState(false);

  const closeDropdown = () => {
    setIsOpen(false);
    setNameReport("");
    setFinished(false);
    setMessageError("");
    setSuccessMessage("");
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setMessageError("");
    const { data, error, success, message } = await onGenerate(nameReport);

    if (!success) {
      setMessageError(message);
    }

    if (success) {
      setSuccessMessage('Registro creado con éxito');
      setFinished(true);
    }

    setIsLoading(false);
  }

  return (
    <div className="flex justify-center items-center relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-center items-center p-3!"
        title="Generar Reporte"
      >
        <PageIcon />
      </Button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="mt-2 min-w-max max-h-60 right-24 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-900"
      >
        {(messageError || successMessage) && (
          <div className="px-7 py-4">
            {messageError && (
              <Alert variant="error" title="Error" message={messageError} showLink={false} />
            )}
            {successMessage && (
              <Alert variant="success" title="Éxito" message={successMessage}
                linkHref='/dashboard/reportes' linkText="Ver reporte" showLink/>
            )}
          </div>
        )}

        {!finished && (
          <>
            <div className="px-3 pt-3 pb-2 border-b border-gray-200 dark:border-gray-800">
              <input
                type="text"
                value={nameReport}
                onChange={(event) => setNameReport(event.target.value)}
                placeholder='Nombre del reporte'
                className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <div className="flex justify-end items-center gap-2 px-3 py-2">
              <Button
                variant="primary"
                onClick={closeDropdown}
                className="flex justify-center items-center p-3!"
              >
                {dictionary.btn.cancel}
              </Button>
              <Button
                variant="outline"
                onClick={handleGenerateReport}
                className="flex justify-center items-center p-3!"
                title="Generar Reporte"
              >
                {dictionary.btn.generate_report}
                <PageIcon />
              </Button>
            </div>

            <div>
              {isLoading && (
                <div
                  className="loader absolute inset-0 bg-white/80 w-[110%] h-[110%] shadow-lg rounded-xl -left-[5%] -top-[5%] flex items-center justify-center">
                  <div className="w-32 h-32"><Loader /></div>
                </div>
              )}
            </div>
          </>
        )}
      </Dropdown>
    </div>
  )
}

export default ButtonReport;
