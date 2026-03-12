export const dictionary = {
  auth: {
    sign_in: 'Iniciar Sesión',
    sign_in_message: '¡Ingresa tu correo electrónico y contraseña para iniciar sesión!',
    reset_password_title: 'Recupera tu contraseña',
    reset_password_message: '¡No te preocupes! Solo ingresa tu correo electrónico y te enviaremos un mensaje con instrucciones para restablecer tu contraseña.',
    sign_up_invite: '¿No tienes una cuenta? Regístrate',
    sign_up: 'Registrarse',
    sign_up_message: '¡Crea tu cuenta para comenzar a gestionar tu inventario de manera eficiente!',
    ready_have_account: '¿Ya tienes una cuenta? Inicia sesión',
  },

  form: {
    email: 'Correo electrónico',
    password: 'Contraseña',
    name: 'Nombre',
    last_name: 'Apellido/s',
    full_name: 'Nombre Completo',
    price: 'Precio de venta',
    category: 'Categoría',
    shelf: 'Estantería',
    price_sale: 'Precio de Venta',
    // keep_me_logged_in: 'Mantenerme conectado',
    forgot_password: '¿Olvidaste tu contraseña?',
    write_password: 'Escribe tu contraseña',
    remember_password: '¿Recordaste tu contraseña? Inicia sesión',
    confirm_password: 'Confirmar Contraseña',
    write_password_confirm: 'Escribe nuevamente tu contraseña para confirmarla',
    write_here: 'Escribe aquí',
  },

  site: {
    name: 'INDUMIL'
  },

  msg: {
    EMAIL_AND_PASSWORD_REQUIRED: 'Correo electrónico y contraseña son requeridos',
    SIGN_IN_FAILED: 'Error al iniciar sesión',
    SIGN_IN_SUCCESS: 'Inicio de sesión exitoso',
    SIGN_IN_ERROR: 'Error al iniciar sesión',
    SIGN_UP_FAILED: 'Error al registrarse',
    SIGN_UP_SUCCESS: 'Registro exitoso. Por favor, revisa tu correo electrónico para verificar tu cuenta.',
    SIGN_UP_ERROR: 'Error al registrarse',
    invalid_credentials: 'Contraseña o correo electrónico incorrectos',
    SIGN_OUT_ERROR: 'Error al cerrar sesión',
    EMAIL_REQUIRED: 'Correo electrónico es requerido',
    SEND_EMAIL_FAILED: 'Error al enviar el correo electrónico',
    over_email_send_rate_limit: 'Has Superado el límite de envíos de correos electrónicos. Por favor, espera un momento antes de intentarlo nuevamente.',
    SEND_EMAIL_SUCCESS: 'Hemos enviado un correo electrónico con instrucciones para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada.',
    PASSWORD_DONT_MATCH: 'Las contraseñas no coinciden',
    UP_USER_FAILED: 'Error al actualizar datos del usuario',
    UP_USER_ERROR: 'Error al actualizar datos del usuario',
    UP_USER_SUCCESS: 'Datos del usuario actualizados exitosamente',
    LINK_SESSION_EXPIRED: 'El enlace de recuperación ha expirado o es inválido. Por favor, solicita un nuevo enlace para restablecer tu contraseña.',
    same_password: 'La nueva contraseña no puede ser igual a la contraseña anterior. Por favor, elige una contraseña diferente.',
    weak_password: 'La contraseña es demasiado corta. Por favor, elige una contraseña de al menos 6 caracteres.',
    DATA_REQUIRED: 'Falta información requerida. Por favor, completa todos los campos necesarios.',
    GET_DATA_FAILED: 'Error al obtener datos',
    GET_DATA_SUCCESS: 'Datos obtenidos exitosamente',
    GET_DATA_ERROR: 'Error al obtener datos',
    PGRST205: 'Al parecer, no se pudo establecer una conexión con la base de datos. Error interno del servidor.',
    PRODUCT_NOT_FOUND: 'Producto no encontrado',
    INVALID_AMOUNT_PRICE: 'Cantidad de precios no válida. Debe ser un numero entre 0 y $99.999.999,99',
    have_changes_without_save: 'Tienes cambios sin guardar. Si continúas, perderás la información editada.',
    have_changes_without_save_title: '¿Modificaste algo?',
  },

  welcome: {
    title: '¡Gusto de tenerte por aquí nuevamente!',
  },

  btn: {
    sign_in: 'Iniciar Sesión',
    sign_out: 'Cerrar Sesión',
    reset_password: 'Restablecer Contraseña',
    sign_up: 'Registrarse',
    previus: 'Anterior',
    next: 'Siguiente',
    save: 'Guardar',
    edit: 'Editar',
    delete: 'Eliminar',
    create: 'Crear',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
  },
  admin: {
    store: {
      categories: {
        title: 'Lista de Categorías',
        description: 'Gestiona tus categorías. Agrega, edita y elimina categorías',
      },
      products: {
        title: 'Lista de Productos',
        description: 'Gestiona tus productos. Agrega, edita y elimina productos, mantén tu inventario actualizado',
      },
      shelfies: {
        title: 'Lista de Estanterías',
        description: 'Gestiona tus estanterías. Agrega, edita y elimina estanterías, mantén tu inventario organizado',
      }
    },
    dashboard: {
      sales: {
        title: 'Ventas Diarias',
        description: 'Gestiona las ventas diarias y vea los detalles de cada venta en el panel de administración.',
      },
      products: {
        title: 'Dashboard de Productos',
        description: 'Visualiza los produts, ganancias, ventas y más detalles de tu tienda en el dashboard de productos. Administra tu inventario y optimiza tus ventas con facilidad.',
      }
    }
  }
}