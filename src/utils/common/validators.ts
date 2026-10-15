// Valida que un texto solo contenga letras, espacios, tildes y ñ.
export const containsOnlyLetters = (
    value: string
): boolean => {
    const regex =
        /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]+$/;

    return regex.test(value);
};

// Valida que un texto solo contenga números.
export const containsOnlyNumbers = (
    value: string
): boolean => {
    const regex = /^[0-9]+$/;

    return regex.test(value);
};

// Valida el formato básico del correo electrónico.
export const isValidEmail = (
    email: string
): boolean => {
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
};
// Valida un número de teléfono: solo números, entre 7 y 15 dígitos.
export const isValidPhone = (
    phone: string
): boolean => {
    return (
        containsOnlyNumbers(phone) &&
        phone.length >= 7 &&
        phone.length <= 15
    );
};
