import Alert from "@/components/ui/alert/Alert";
import {dictionary} from "@/dictionary";
import getUserById from "@/server/auth/getUserById";
import ProfileForm from "@/components/auth/ProfileForm";

type PageProps = {
  params: Promise<{ id: string }>;
}

export default async function PageUser({params}: PageProps) {
  const {id} = await params;

  const {data: user, message, success} = await getUserById({id});

  if (!success) {
    return (
      <Alert
        title='Error cargando producto'
        message={dictionary.msg[message as keyof typeof dictionary.msg] || 'No se pudo cargar el perfil. Intente nuevamente.'}
        variant="error"
        key='errror'
      />
    );
  }

  if (!user) {
    return (
      <Alert
        title={`El producto con ID ${id} no fue encontrado`}
        message={dictionary.msg[message as keyof typeof dictionary.msg || 'PROFILE_NOT_FOUND']}
        variant="warning"
        key='not-found'
      />
    );
  }

  return <ProfileForm user={user}/>;
}