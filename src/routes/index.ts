import { Router } from "express";

import userRoutes from "./users/user.routes.js";
import profileRoutes from "./users/profile.routes.js";
import pqrRoutes from "./pqrs/pqr.routes.js";
import authRoutes from "./auth/auth.routes.js";
import pqrMessageRoutes from "./pqrs/pqrMessage.routes.js";
import notificationRoutes from "./notifications/notification.routes.js";

import identificationTypeRoutes from "./common/identificationType.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    message: "API funcionando correctamente",
  });
});

// Usuarios y autenticación.
router.use("/users", userRoutes);
router.use("/profile", profileRoutes);
router.use("/auth", authRoutes);

// PQR.
router.use("/pqrs", pqrRoutes);
router.use("/", pqrMessageRoutes);

// Notificaciones.
router.use("/notifications", notificationRoutes);

// Recursos comunes.
router.use(
  "/common/identification-types",
  identificationTypeRoutes
);

export default router;