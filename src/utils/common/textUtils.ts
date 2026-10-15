// Convierte un valor en texto, quita espacios al inicio y al final
// y deja un solo espacio entre palabras.
export const cleanText = (
    value: unknown
): string => {
    if (typeof value !== "string") {
        return "";
    }

    return value
        .trim()
        .replace(/\s+/g, " ");
};

// Quita todos los espacios de un valor (para documentos y teléfonos).
export const removeSpaces = (
    value: unknown
): string => {
    if (typeof value !== "string") {
        return "";
    }

    return value.replace(/\s+/g, "");
};
