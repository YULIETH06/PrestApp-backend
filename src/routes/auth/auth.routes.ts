import { Router } from "express";
import {
  registerUser,
  registerUsersBulk,
} from "../../controllers/auth/auth.controller.js";
import { uploadExcel } from "../../middlewares/upload.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";

const router = Router();

router.post("/register", registerUser);

// Registra usuarios mediante carga masiva desde archivo Excel.
router.post(
  "/register/bulk",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  uploadExcel.single("file"),
  registerUsersBulk
);

export default router;