import type {
  Request,
  Response,
} from "express";

import {
  getAllUsersService,
  getUserByIdService,
  updateUserRoleService,
  getAgentsService,
  resetUserPasswordService,
} from "../../services/users/user.service.js";

export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users =
      await getAllUsersService();

    return res.status(200).json({
      message:
        "Usuarios obtenidos correctamente",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Error al obtener los usuarios",
    });
  }
};

export const getAgents = async (
  req: Request,
  res: Response
) => {
  try {
    const agents =
      await getAgentsService();

    return res.status(200).json({
      message:
        "Agentes obtenidos correctamente",
      agents,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Error al obtener los agentes",
    });
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      id,
    } = req.params;

    const {
      role,
    } = req.body;

    const userId = Number(id);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return res.status(400).json({
        message:
          "El id del usuario no es válido",
      });
    }

    if (!role) {
      return res.status(400).json({
        message:
          "El rol es obligatorio",
      });
    }

    const allowedRoles = [
      "USER",
      "ADMIN",
      "AGENT",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message:
          "Rol no válido",
        allowedRoles,
      });
    }

    const userExists =
      await getUserByIdService(
        userId
      );

    if (!userExists) {
      return res.status(404).json({
        message:
          "El usuario no existe",
      });
    }

    const updatedUser =
      await updateUserRoleService(
        userId,
        role
      );

    return res.status(200).json({
      message:
        "Rol del usuario actualizado correctamente",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Error al actualizar el rol del usuario",
      error,
    });
  }
};

// Permite al administrador restablecer la contraseña de un usuario.
export const resetUserPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      id,
    } = req.params;

    const {
      newPassword,
    } = req.body;

    const userId = Number(id);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return res.status(400).json({
        message:
          "El id del usuario no es válido",
      });
    }

    if (
      typeof newPassword !==
      "string" ||
      !newPassword.trim()
    ) {
      return res.status(400).json({
        message:
          "La nueva contraseña es obligatoria",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "La nueva contraseña debe tener mínimo 6 caracteres",
      });
    }

    const updatedUser =
      await resetUserPasswordService(
        userId,
        newPassword
      );

    if (!updatedUser) {
      return res.status(404).json({
        message:
          "El usuario no existe",
      });
    }

    return res.status(200).json({
      message:
        "Contraseña del usuario actualizada correctamente",
      user: updatedUser,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
      "La nueva contraseña debe ser diferente a la contraseña actual"
    ) {
      return res.status(400).json({
        message:
          error.message,
      });
    }

    return res.status(500).json({
      message:
        "Error al actualizar la contraseña del usuario",
    });
  }
};