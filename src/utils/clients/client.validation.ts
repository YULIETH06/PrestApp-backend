import {
    containsOnlyLetters,
    isValidPhone,
} from "../common/validators.js";

import {
    cleanText,
    removeSpaces,
} from "../common/textUtils.js";

import type {
    ClientStatusFilter,
    ClientValidationResult,
} from "../../interfaces/clients/client.interface.js";

// Valida y limpia los datos de un cliente.
// Se usa al crear y al editar un cliente.
export const validateClientData = (
    body: unknown
): ClientValidationResult => {
    const data = (
        typeof body === "object" && body !== null
            ? body
            : {}
    ) as Record<string, unknown>;

    // Tipo de identificación.
    const identificationTypeId = Number(
        data.identificationTypeId
    );

    if (
        !Number.isInteger(identificationTypeId) ||
        identificationTypeId <= 0
    ) {
        return {
            isValid: false,
            message: "El tipo de identificación es obligatorio",
        };
    }

    // Número de identificación.
    const identificationNumber = removeSpaces(
        data.identificationNumber
    ).toUpperCase();

    if (!identificationNumber) {
        return {
            isValid: false,
            message: "El número de identificación es obligatorio",
        };
    }

    if (!/^[A-Z0-9]{5,20}$/.test(identificationNumber)) {
        return {
            isValid: false,
            message:
                "El número de identificación debe tener entre 5 y 20 caracteres, solo letras y números",
        };
    }

    // Nombre completo.
    const fullName = cleanText(data.fullName);

    if (!fullName) {
        return {
            isValid: false,
            message: "El nombre completo es obligatorio",
        };
    }

    if (
        fullName.length < 3 ||
        fullName.length > 150
    ) {
        return {
            isValid: false,
            message:
                "El nombre completo debe tener entre 3 y 150 caracteres",
        };
    }

    if (!containsOnlyLetters(fullName)) {
        return {
            isValid: false,
            message:
                "El nombre completo solo puede contener letras y espacios",
        };
    }

    // Teléfono principal.
    const phone = removeSpaces(data.phone);

    if (!phone) {
        return {
            isValid: false,
            message: "El teléfono es obligatorio",
        };
    }

    if (!isValidPhone(phone)) {
        return {
            isValid: false,
            message:
                "El teléfono debe tener entre 7 y 15 dígitos, solo números",
        };
    }

    // Teléfono secundario (opcional).
    const secondaryPhoneValue = removeSpaces(
        data.secondaryPhone
    );

    const secondaryPhone = secondaryPhoneValue || null;

    if (
        secondaryPhone &&
        !isValidPhone(secondaryPhone)
    ) {
        return {
            isValid: false,
            message:
                "El teléfono secundario debe tener entre 7 y 15 dígitos, solo números",
        };
    }

    if (secondaryPhone === phone) {
        return {
            isValid: false,
            message:
                "El teléfono secundario no puede ser igual al teléfono principal",
        };
    }

    // Dirección.
    const address = cleanText(data.address);

    if (!address) {
        return {
            isValid: false,
            message: "La dirección es obligatoria",
        };
    }

    if (address.length > 200) {
        return {
            isValid: false,
            message:
                "La dirección no puede tener más de 200 caracteres",
        };
    }

    // Barrio.
    const neighborhood = cleanText(data.neighborhood);

    if (!neighborhood) {
        return {
            isValid: false,
            message: "El barrio es obligatorio",
        };
    }

    if (neighborhood.length > 100) {
        return {
            isValid: false,
            message:
                "El barrio no puede tener más de 100 caracteres",
        };
    }

    // Notas (opcional).
    const notesValue =
        typeof data.notes === "string"
            ? data.notes.trim()
            : "";

    const notes = notesValue || null;

    if (
        notes &&
        notes.length > 500
    ) {
        return {
            isValid: false,
            message:
                "Las notas no pueden tener más de 500 caracteres",
        };
    }

    return {
        isValid: true,
        data: {
            identificationTypeId,
            identificationNumber,
            fullName,
            phone,
            secondaryPhone,
            address,
            neighborhood,
            notes,
        },
    };
};

// Convierte el filtro de estado recibido en la URL.
// Si no se envía, se listan todos los clientes.
// Si el valor no es válido, devuelve null.
export const parseClientStatus = (
    value: unknown
): ClientStatusFilter | null => {
    if (
        value === undefined ||
        value === ""
    ) {
        return "all";
    }

    if (
        value === "active" ||
        value === "inactive" ||
        value === "all"
    ) {
        return value;
    }

    return null;
};
