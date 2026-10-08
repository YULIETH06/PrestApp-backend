import type { Server } from "socket.io";
import type { AuthSocket } from "../interfaces/sockets/socket.interface.js";

// Registra la conexión general de Socket.IO
export const registerSockets = (io: Server) => {
    io.on("connection", (socket: AuthSocket) => {
        console.log("Usuario conectado por socket:", socket.user?.email);

        // Une al usuario autenticado a su sala personal para notificaciones
        if (socket.user) {
            socket.join(`user_${socket.user.id}`);
        }

        socket.on("disconnect", () => {
            console.log("Usuario desconectado:", socket.user?.email);
        });
    });
};