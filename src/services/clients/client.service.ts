import type {
    Prisma,
} from "@prisma/client";

import prisma from "../../config/client.js";

import type {
    ClientFilters,
    ClientFormData,
} from "../../interfaces/clients/client.interface.js";

import {
    getActiveIdentificationTypeByIdService,
} from "../common/identificationType.service.js";

// Campos que se devuelven al consultar un cliente.
// Se define una sola vez para que todas las consultas respondan igual.
const clientSelect = {
    id: true,
    identificationNumber: true,
    fullName: true,
    phone: true,
    secondaryPhone: true,
    address: true,
    neighborhood: true,
    notes: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
    identificationType: {
        select: {
            id: true,
            code: true,
            name: true,
        },
    },
} satisfies Prisma.ClientSelect;

// Revisa las reglas que se repiten al crear y al editar un cliente:
// 1. El tipo de identificación debe existir y estar activo.
// 2. El prestamista no puede tener otro cliente con el mismo documento.
// Al editar se envía el id del cliente (excludeClientId) para no
// compararlo consigo mismo. Al crear se envía null.
const validateClientRules = async (
    userId: number,
    data: ClientFormData,
    excludeClientId: number | null
) => {
    const identificationType =
        await getActiveIdentificationTypeByIdService(
            data.identificationTypeId
        );

    if (!identificationType) {
        throw new Error(
            "El tipo de identificación no existe o está inactivo"
        );
    }

    const where: Prisma.ClientWhereInput = {
        userId,
        identificationNumber: data.identificationNumber,
    };

    if (excludeClientId) {
        where.NOT = {
            id: excludeClientId,
        };
    }

    const duplicateClient = await prisma.client.findFirst({
        where,
        select: {
            id: true,
        },
    });

    if (duplicateClient) {
        throw new Error(
            "Ya tienes un cliente registrado con ese número de identificación"
        );
    }
};

// Busca un cliente por su id, solo dentro de los clientes del prestamista.
// Si el cliente no existe o pertenece a otro prestamista, lanza un error.
export const getClientByIdService = async (
    userId: number,
    clientId: number
) => {
    const client = await prisma.client.findFirst({
        where: {
            id: clientId,
            userId,
        },
        select: clientSelect,
    });

    if (!client) {
        throw new Error(
            "El cliente no existe"
        );
    }

    return client;
};

// Lista los clientes del prestamista con búsqueda y filtro por estado.
// La búsqueda revisa nombre, número de identificación y teléfonos.
export const getClientsService = async (
    userId: number,
    filters: ClientFilters
) => {
    const where: Prisma.ClientWhereInput = {
        userId,
    };

    if (filters.status === "active") {
        where.isActive = true;
    }

    if (filters.status === "inactive") {
        where.isActive = false;
    }

    if (filters.search) {
        where.OR = [
            {
                fullName: {
                    contains: filters.search,
                },
            },
            {
                identificationNumber: {
                    contains: filters.search,
                },
            },
            {
                phone: {
                    contains: filters.search,
                },
            },
            {
                secondaryPhone: {
                    contains: filters.search,
                },
            },
        ];
    }

    const clients = await prisma.client.findMany({
        where,
        select: clientSelect,
        orderBy: {
            fullName: "asc",
        },
    });

    return clients;
};

// Registra un cliente nuevo para el prestamista.
export const createClientService = async (
    userId: number,
    data: ClientFormData
) => {
    await validateClientRules(
        userId,
        data,
        null
    );

    const client = await prisma.client.create({
        data: {
            ...data,
            userId,
        },
        select: clientSelect,
    });

    return client;
};

// Actualiza los datos de un cliente del prestamista.
export const updateClientService = async (
    userId: number,
    clientId: number,
    data: ClientFormData
) => {
    // Lanza error si el cliente no existe o es de otro prestamista.
    await getClientByIdService(
        userId,
        clientId
    );

    await validateClientRules(
        userId,
        data,
        clientId
    );

    const client = await prisma.client.update({
        where: {
            id: clientId,
        },
        data,
        select: clientSelect,
    });

    return client;
};

// Activa o desactiva un cliente del prestamista.
// Los clientes no se eliminan para conservar su historial.
export const updateClientStatusService = async (
    userId: number,
    clientId: number,
    isActive: boolean
) => {
    // Lanza error si el cliente no existe o es de otro prestamista.
    await getClientByIdService(
        userId,
        clientId
    );

    const client = await prisma.client.update({
        where: {
            id: clientId,
        },
        data: {
            isActive,
        },
        select: clientSelect,
    });

    return client;
};
