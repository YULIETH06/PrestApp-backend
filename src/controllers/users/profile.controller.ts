import type { Response } from "express";
import prisma from "../../config/client.js";
import type { AuthRequest } from "../../interfaces/auth/auth.interface.js";

export const getProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Usuario no autenticado.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado.",
      });
    }

    return res.status(200).json({
      message: "Perfil obtenido correctamente.",
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error al obtener el perfil.",
    });
  }
};