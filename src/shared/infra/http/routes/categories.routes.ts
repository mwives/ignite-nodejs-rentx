import { Router } from "express";
import multer from "multer";

import { CreateCategoryController } from "@modules/cars/useCases/createCategory/CreateCategoryController";
import { ImportCategoriesController } from "@modules/cars/useCases/importCategories/ImportCategoriesController";
import { ListCategoriesController } from "@modules/cars/useCases/listCategories/ListCategoriesController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuth } from "../middlewares/ensureAuth";

const categoriesRouter = Router();

const upload = multer({
  dest: "./tmp",
});

const createCategoryController = new CreateCategoryController();
const importCategoriesController = new ImportCategoriesController();
const listCategoriesController = new ListCategoriesController();

categoriesRouter.post(
  "/",
  ensureAuth,
  ensureAdmin,
  createCategoryController.handle
);

categoriesRouter.post(
  "/import",
  upload.single("file"),
  ensureAuth,
  ensureAdmin,
  importCategoriesController.handle
);

categoriesRouter.get("/", listCategoriesController.handle);

export { categoriesRouter };
