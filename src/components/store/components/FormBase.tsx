'use client';

import Button from "@/components/ui/button/Button";
import React, {useEffect, useMemo, useState} from "react";
import {dictionary} from "@/dictionary";
import Loader from '@/icons/loader.svg';
import Alert from "@/components/ui/alert/Alert";
import RenderFields, {FieldGroupType, FieldType} from "../renderFields";
import {useRouter} from "next/navigation";
import {ArrowRightIcon} from "@/icons/index";
import {Modal} from "@/components/ui/modal";

type Item = {
  id: string | number;
  [key: string]: any;
} | null;

type FormNameStatusProps = {
  item: Item;
  isNew: boolean;
  entityLabel: string;
  redirectPath: string;
  sectionLabel: string;
  onSaveAction: (data: { [key: string]: string }, isNew: boolean, id?: string | number) => Promise<{
    success: boolean;
    message?: string | null;
  }>;
  formFields: (FieldType | FieldGroupType)[];
  dataForm: { [key: string]: any };
};

const FormBase = (
  {
    item,
    isNew,
    entityLabel,
    redirectPath,
    sectionLabel,
    onSaveAction,
    formFields,
    dataForm
  }: FormNameStatusProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<null | 'back'>(null);

  const [initialFormSnapshot] = useState(() => JSON.stringify({...dataForm}));
  const currentFormSnapshot = useMemo(() => JSON.stringify({...dataForm}), [dataForm]);
  const hasUnsavedChanges = initialFormSnapshot !== currentFormSnapshot && !loading;
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const confirmDiscardChanges = () => {
    if (!hasUnsavedChanges) return true;
    setPendingNavigation('back');
    setShowDiscardModal(true);
    return false;
  };

  const handleBack = () => {
    if (!confirmDiscardChanges()) return;
    router.back();
  };

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);

    if (pendingNavigation === 'back') {
      router.back();
    }

    setPendingNavigation(null);
  };

  const handleCloseDiscardModal = () => {
    setShowDiscardModal(false);
    setPendingNavigation(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const result = await onSaveAction(
        {...dataForm},
        isNew,
        item?.id
      );

      if (!result.success) {
        setMessage(result.message || `Error al guardar ${entityLabel}`);
        setLoading(false);
        window.scrollTo({top: 0, behavior: 'smooth'});
        return;
      }

      setSuccessMessage(isNew ? `${entityLabel} creada exitosamente` : `${entityLabel} actualizada exitosamente`);
      setLoading(false);

      setTimeout(() => router.push(redirectPath), 1500);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Error al guardar ${entityLabel}`);
      setLoading(false);
      window.scrollTo({top: 0, behavior: 'smooth'});

    }

    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return (
    <>
      <div className="w-full mx-auto px-4 py-8 lg:py-20 relative">
        <div
          className='absolute py-2 px-5 rounded-lg bg-brand-500 text-white flex cursor-pointer hover:bg-brand-600 shadow-sm shadow-brand-300 z-20'
          onClick={handleBack}
        >
          <div className='rotate-180 max-w-max mr-3'>
            <ArrowRightIcon/>
          </div>
          Volver
        </div>
        <div className="my-32">
          {message && (
            <Alert variant="error" title="Error" message={message} showLink={false}/>
          )}
          {successMessage && (
            <Alert variant="success" title="Éxito" message={successMessage} showLink={false}/>
          )}

          <div className='mt-10'>
            <h1 className="text-2xl font-bold text-center mb-2">
              {isNew ? `Crear ${entityLabel}` : `Editar ${entityLabel}: ${item?.name || ''}`}
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              {isNew
                ? `Complete el formulario para crear una nueva ${entityLabel}.`
                : `Actualice los campos necesarios para editar ${entityLabel}.`}
            </p>
          </div>

          <div className="relative py-3 sm:py-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"/>
            </div>
            <div className="relative flex justify-center text-sm">
            <span className="p-2 text-gray-400 bg-gray-50 dark:bg-gray-900 sm:px-5 sm:py-2">
              {sectionLabel}
            </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <div className="space-y-6">
              <RenderFields fields={formFields}/>
              <div className="flex  gap-5">
                <Button size="md">
                  {dictionary.btn[isNew ? 'create' : 'save']}
                </Button>
                <div
                  className='py-2 px-5 rounded-lg bg-brand-500 text-white flex items-center cursor-pointer hover:bg-brand-600 shadow-sm shadow-brand-300'
                  onClick={handleBack}
                >
                  {dictionary.btn.cancel}
                </div>
              </div>
            </div>
            {loading && (
              <div
                className="loader absolute inset-0 bg-white/80 w-[110%] h-[110%] shadow-lg rounded-xl -left-[5%] -top-[5%] flex items-center justify-center">
                <div className="w-32 h-32"><Loader/></div>
              </div>
            )}
          </form>
        </div>
      </div>
      <Modal isOpen={showDiscardModal} onClose={handleCloseDiscardModal} className='max-w-lg' showCloseButton={false}>
        <div className="p-6 sm:p-7">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {dictionary.msg.have_changes_without_save_title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            {dictionary.msg.have_changes_without_save}
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseDiscardModal}
              className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {dictionary.btn.cancel}

            </button>
            <button
              type="button"
              onClick={handleConfirmDiscard}
              className="inline-flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              {dictionary.btn.confirm}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default FormBase;