import express from "express";
import {
  addCategory,
  getAllCategoryForProduct,
  getAllCategories,
  deleteCategoryById,
  updateCategoryById,
  getCategoryById,
  findCategoryByName,
} from "../controllers/categoryController.js";
import {
  addManufacture,
  deleteManufactureById,
  findManufactureByName,
  getAllManufacture,
  getAllManufactureByStatus,
  getManufactureById,
  getManufactureByStatusId,
  updateManufactureById,
} from "../controllers/manufactureController.js";
import {
  addProduct,
  deleteProductById,
  findProductById,
  findProductByName,
  getAllProduct,
  getProductByCategory,
  updateProductById,
} from "../controllers/productController.js";
import {
  verifyTokenAdmin,
  verifyAccessToken,
} from "../controllers/verifyToken.js";
const router = express.Router();

//manufacture
router.post("/add-manufacture", verifyTokenAdmin, addManufacture);
router.get("/get-all-manufacture", getAllManufacture);
router.get("/get-count-status-manufacture", getAllManufactureByStatus);
router.get("/get-manufacture-by-statusid/:statusid", getManufactureByStatusId);
router.get("/delete-by-id/:id", verifyTokenAdmin, deleteManufactureById);
router.post("/update-by-id/:id", verifyTokenAdmin, updateManufactureById);
router.get("/get-by-id/:id", getManufactureById);
router.get("/find-by-name/:search", findManufactureByName);

//category
router.post("/add-category", verifyTokenAdmin, addCategory);
router.get("/get-all-category-for-product", getAllCategoryForProduct);
router.get("/get-all-category", getAllCategories);
router.post("/update-category/:id", verifyTokenAdmin, updateCategoryById);
router.get("/delete-category/:id", verifyTokenAdmin, deleteCategoryById);
router.get("/get-category-by-id/:id", verifyTokenAdmin, getCategoryById);
router.get("/search-category/:searchKey", findCategoryByName);

//products
router.post("/add-product", verifyTokenAdmin, addProduct);
router.get("/get-all-product/:page", getAllProduct);
router.get("/get-product-by-category/:id", getProductByCategory);
router.get("/delete-product-by-id/:id", verifyTokenAdmin, deleteProductById);
router.get("/search-product/:searchKey", findProductByName);
router.post("/update-product/:id", verifyTokenAdmin, updateProductById);
router.get("/find-product-by-id/:id", findProductById);
export default router;
