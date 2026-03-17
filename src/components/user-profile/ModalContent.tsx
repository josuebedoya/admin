import React, {useState} from 'react';
import {Modal} from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import {updateUserProfile} from "@/server/actions/user"; // Importar Server Action

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  handleSave: () => void;
  user?: {
    email?: string | null;
    phone?: string | null;
  } | null;
  displayName: string;
}

const ModalContent = ({isOpen, displayName, closeModal, user, handleSave}: Props) => {
  // Inicializamos estados que pueden actualizarse cuando cambian los props
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar estado cuando el modal se abre o cambian los props
  React.useEffect(() => {
    if (isOpen) {
      setFirstName(displayName?.split(' ')[0] || "");
      setLastName(displayName?.split(' ')[1] || "");
      setPhone(user?.phone || "");
    }
  }, [isOpen, displayName, user]);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateUserProfile({firstName, lastName, phone});
      if (response.success) {
        handleSave();
      } else {
        setError(response.message || "Error al actualizar");
      }
    } catch (e) {
      setError("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
      <div
        className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edita tú Perfil
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Aquí puedes actualizar tu información personal. Asegúrate de guardar los cambios antes de salir.
          </p>
        </div>

        {error && <div className="mb-4 text-red-500 text-sm px-2">{error}</div>}

        <form className="flex flex-col" onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}>
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Información Personal
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>Nombre</Label>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Apellido</Label>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Email</Label>
                  <Input
                    type="text"
                    value={user?.email || ''}
                    disabled // Email no editable por ahora
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Teléfono</Label>
                  <Input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal} type="button">
              Cerrar
            </Button>
            <Button size="sm" onClick={undefined} disabled={loading} type="submit">
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalContent;