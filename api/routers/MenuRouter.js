import express from "express";
import { addMenu, getAllMenu } from "../controllers/menuController.js";
import { verifyTokenAdmin } from "../controllers/verifyToken.js";

const router = express.Router();
router.post("/add-menu", verifyTokenAdmin, addMenu);
router.get("/get-all-menu", getAllMenu);
export default router;
