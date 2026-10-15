import type {
    Response,
} from "express";

import type {
    AuthRequest,
} from "../../interfaces/auth/auth.interface.js";

import {
    createClientService,
    getClientByIdService,
    getClientsService,
    updateClientService,
    updateClientStatusService,
} from "../../services/clients/client.service.js";

import {
    parseClientStatus,
    validateClientData,
} from "../../utils/clients/client.validation.js";

import {
    cleanText,
} from "../../utils/common/textUtils.js";

// Obtiene los clientes del usuario autenticado.
// Acepta ?search= para buscar y ?status=active|inactive|all para filtrar.
export const getClients = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Usuario no autenticado",
            });
        }

        const status = parseClientStatus(req.query.status);

        if (!status) {
            return res.status(400).json({
                message:
                    "El estado no es válido. Use active, inactive o all",
            });
        }

        const search = cleanText(req.query.search);

        const clients = await getClientsService(
            req.user.id,
            {
                search,
                status,
            }
        );

        return res.status(200).json({
            message: "Clientes obtenidos correctamente",
            clients,
        });
    } catch (error) {
        return res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Error al obtener los clientes",
        });
    }
};

// Obtiene un cliente del usuario autenticado por su id.
export const getClientById = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Usuario no autenticado",
            });
        }

        const clientId = Number(req.params.id);

        if (
            !Number.isInteger(clientId) ||
            clientId <= 0
        ) {
            return res.status(400).json({
                message: "El id del cliente no es válido",
            });
        }

        const client = await getClientByIdService(
            req.user.id,
            clientId
        );

        return res.status(200).json({
            message: "Cliente obtenido correctamente",
            client,
        });
    } catch (error) {
        return res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Error al obtener el cliente",
        });
    }
};

// Registra un cliente nuevo para el usuario autenticado.
export const createClient = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Usuario no autenticado",
            });
        }

        // Revisa y limpia los datos del formulario.
        const validation = validateClientData(req.body ?? {});

        if (!validation.isValid) {
            return res.status(400).json({
                message: validation.message,
            });
        }

        // El servicio revisa el tipo de identificación
        // y que el documento no esté repetido.
        const client = await createClientService(
            req.user.id,
            validation.data
        );

        return res.status(201).json({
            message: "Cliente registrado correctamente",
            client,
        });
    } catch (error) {
        return res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Error al registrar el cliente",
        });
    }
};

// Actualiza los datos de un cliente del usuario autenticado.
export const updateClient = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Usuario no autenticado",
            });
        }

        const clientId = Number(req.params.id);

        if (
            !Number.isInteger(clientId) ||
            clientId <= 0
        ) {
            return res.status(400).json({
                message: "El id del cliente no es válido",
            });
        }

        // Revisa y limpia los datos del formulario.
        const validation = validateClientData(req.body ?? {});

        if (!validation.isValid) {
            return res.status(400).json({
                message: validation.message,
            });
        }

        // El servicio revisa que el cliente sea del usuario,
        // el tipo de identificación y el documento repetido.
        const client = await updateClientService(
            req.user.id,
            clientId,
            validation.data
        );

        return res.status(200).json({
            message: "Cliente actualizado correctamente",
            client,
        });
    } catch (error) {
        return res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Error al actualizar el cliente",
        });
    }
};

// Activa o desactiva un cliente del usuario autenticado.
// Body esperado: { "isActive": true } o { "isActive": false }
export const updateClientStatus = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Usuario no autenticado",
            });
        }

        const clientId = Number(req.params.id);

        if (
            !Number.isInteger(clientId) ||
            clientId <= 0
        ) {
            return res.status(400).json({
                message: "El id del cliente no es válido",
            });
        }

        const body = req.body ?? {};

        if (typeof body.isActive !== "boolean") {
            return res.status(400).json({
                message:
                    "El campo isActive es obligatorio y debe ser true o false",
            });
        }

        const client = await updateClientStatusService(
            req.user.id,
            clientId,
            body.isActive
        );

        return res.status(200).json({
            message: body.isActive
                ? "Cliente activado correctamente"
                : "Cliente desactivado correctamente",
            client,
        });
    } catch (error) {
        return res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Error al actualizar el estado del cliente",
        });
    }
};
