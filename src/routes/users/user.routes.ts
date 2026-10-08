import {
  Router,
} from "express";

import {
  getUsers,
  updateUserRole,
  resetUserPassword,
} from "../../controllers/users/user.controller.js";

import {
  registerUsersBulk,
} from "../../controllers/users/userBulk.controller.js";

import {
  authMiddleware,
  roleMiddleware,
  uploadExcel,
} from "../../middlewares/index.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  getUsers
);

// Registra usuarios mediante carga masiva desde archivo Excel.
// Esta operación pertenece a la administración de usuarios.
router.post(
  "/bulk",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  uploadExcel.single("file"),
  registerUsersBulk
);

router.patch(
  "/:id/role",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  updateUserRole
);

// Solo ADMIN puede restablecer la contraseña de otro usuario.
router.patch(
  "/:id/password",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  resetUserPassword
);

export default router;