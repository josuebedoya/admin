'use client';

import {useState} from 'react';
import Button from "@/components/ui/button/Button";
import {Modal} from "@/components/ui/modal";
import {vaciarProducts} from "@/server/actions/store";

type ButtonVaciarProps = {
  onVaciar?: () => void;
};

const ButtonVaciar = ({onVaciar}: ButtonVaciarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setIsLoading(true);
    setError('');
    const {success, message} = await vaciarProducts();
    if (!success) {
      setError(message || 'Error al vaciar');
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setIsOpen(false);
      onVaciar?.();
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Vaciar
      </Button>

      <Modal isOpen={isOpen} onClose={() => !isLoading && setIsOpen(false)} showCloseButton={!isLoading} className="max-w-md mx-4">
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            ¿Vaciar productos activos?
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Todos los productos activos se marcarán como inactivos y pasarán al almacén. Esta acción se puede revertir activando cada producto individualmente.
          </p>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? 'Vaciando...' : 'Confirmar'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ButtonVaciar;
