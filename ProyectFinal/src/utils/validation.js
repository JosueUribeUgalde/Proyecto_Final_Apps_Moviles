export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validationMessages = {
  email: {
    required: 'El email es requerido',
    invalid: 'Por favor ingresa un email válido',
  },
  general: {
    networkError: 'Error de conexión. Intenta nuevamente.',
    success: 'Solicitud enviada exitosamente',
  }
};