import express from "express";

import { deleteAllUser, getAllUsers } from "../controllers/UserController.js";
import {
  registerUser,
  loginUser,
  requestRefreshToken,
  logoutUser,
} from "../controllers/authController.js";
import {
  verifyAccessToken,
  verifyTokenAdmin,
} from "../controllers/verifyToken.js";
import { addRole } from "../controllers/roleController.js";
const router = express.Router();
router.post("/create-user", registerUser);
router.get("/get-all-user", verifyTokenAdmin, getAllUsers);
router.delete("/delete-all", verifyAccessToken, deleteAllUser);
router.post("/login", loginUser);
router.post("/refresh", requestRefreshToken);
router.post("/add-role", addRole);
router.post("/logout", verifyAccessToken, logoutUser);
export default router;
