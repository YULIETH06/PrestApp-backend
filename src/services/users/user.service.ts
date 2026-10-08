import bcrypt from "bcryptjs";

import prisma from "../../config/client.js";

import {
    Role,
} from "@prisma/client";

export const getAllUsersService = async () => {
    const users = await prisma.user.findMany({
        orderBy: {
            id: "desc",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    return users;
};

// Consulta la existencia de un usuario mediante su identificador.
export const getUserByIdService = async (
    id: number
) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
        },
    });

    return user;
};

export const updateUserRoleService = async (
    id: number,
    role: Role
) => {
    const user = await prisma.user.update({
        where: {
            id,
        },
        data: {
            role,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    return user;
};

// Restablece la contraseña de un usuario desde la administración.
export const resetUserPasswordService = async (
    userId: number,
    newPassword: string
) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            password: true,
        },
    });

    if (!user) {
        return null;
    }

    const isSamePassword = await bcrypt.compare(
        newPassword,
        user.password
    );

    if (isSamePassword) {
        throw new Error(
            "La nueva contraseña debe ser diferente a la contraseña actual"
        );
    }

    const hashedPassword = await bcrypt.hash(
        newPassword,
        10
    );

    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    return updatedUser;
};