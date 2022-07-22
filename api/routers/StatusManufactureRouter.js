import express from "express";
import {
  addStatusManufacture,
  getAllStatus,
  getAllStatusManufacture,
} from "../controllers/statusManufacture.js";
const router = express.Router();

router.post("/add-status", addStatusManufacture);
router.get("/get-all-status", getAllStatusManufacture);
router.get("/all-status", getAllStatus);

export default router;
