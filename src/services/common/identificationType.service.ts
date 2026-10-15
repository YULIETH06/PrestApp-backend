import prisma from "../../config/client.js";

export const getActiveIdentificationTypesService =
    async () => {
        const identificationTypes =
            await prisma.identificationType.findMany({
                where: {
                    isActive: true,
                },
                select: {
                    id: true,
                    code: true,
                    name: true,
                },
                orderBy: {
                    name: "asc",
                },
            });

        return identificationTypes;
    };

// Busca un tipo de identificación activo por su id.
// Devuelve null si no existe o está inactivo.
export const getActiveIdentificationTypeByIdService =
    async (id: number) => {
        const identificationType =
            await prisma.identificationType.findFirst({
                where: {
                    id,
                    isActive: true,
                },
                select: {
                    id: true,
                    code: true,
                    name: true,
                },
            });

        return identificationType;
    };
