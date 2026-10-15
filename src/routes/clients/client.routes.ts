import {
    Router,
} from "express";

import {
    createClient,
    getClientById,
    getClients,
    updateClient,
    updateClientStatus,
} from "../../controllers/clients/client.controller.js";

import {
    authMiddleware,
    roleMiddleware,
} from "../../middlewares/index.js";

const router = Router();

// Cada usuario (USER o ADMIN) administra solo sus propios clientes.
// El servicio filtra siempre por el id del usuario del token.

// Lista los clientes del usuario.
// Filtros opcionales: ?search=texto&status=active|inactive|all
router.get(
    "/",
    authMiddleware,
    roleMiddleware(["USER", "ADMIN"]),
    getClients
);

// Obtiene un cliente por su id.
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(["USER", "ADMIN"]),
    getClientById
);

// Registra un cliente nuevo.
router.post(
    "/",
    authMiddleware,
    roleMiddleware(["USER", "ADMIN"]),
    createClient
);

// Actualiza los datos de un cliente.
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(["USER", "ADMIN"]),
    updateClient
);

// Activa o desactiva un cliente. Los clientes no se eliminan.
router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware(["USER", "ADMIN"]),
    updateClientStatus
);

export default router;
