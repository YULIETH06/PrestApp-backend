import { createNotificationService } from "../services/notifications/notification.service.js";

// Prueba temporal: crea una notificación para el usuario con id 1.
// Ejecutar con: npx tsx src/scripts/testNotification.ts
const notification = await createNotificationService({
    title: "Prueba",
    message: "Notificación de prueba después de quitar pqrId.",
    type: "GENERAL",
    userId: 1,
});

console.log("Notificación creada:", notification);
process.exit(0);