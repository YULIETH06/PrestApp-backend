import { Router } from "express";

import userRoutes from "./users/user.routes.js";
import profileRoutes from "./users/profile.routes.js";
import pqrRoutes from "./pqrs/pqr.routes.js";
import authRoutes from "./auth/auth.routes.js"
import pqrMessageRoutes from "./pqrs/pqrMessage.routes.js";
import notificationRoutes from "./notifications/notification.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    message: "API funcionando correctamente",
  });
});

router.use("/users", userRoutes);
router.use("/profile", profileRoutes);
router.use("/pqrs", pqrRoutes);
router.use("/auth", authRoutes);
router.use("/", pqrMessageRoutes);
router.use("/notifications", notificationRoutes);

export default router;