// Valida que el nombre solo contenga letras, espacios, tildes y ñ
export const isValidName = (name: string): boolean => {
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    return nameRegex.test(name);
};

// Valida el formato básico del correo electrónico
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};