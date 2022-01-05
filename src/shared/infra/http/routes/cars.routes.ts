import { Router } from "express";
import multer from "multer";

import uploadConfig from "@config/upload";
import { CreateCarController } from "@modules/cars/useCases/createCar/CreateCarController";
import { CreateCarSpecificationController } from "@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController";
import { ListAvailableCarsController } from "@modules/cars/useCases/listAvailableCars/ListAvailableCarsController";
import { UploadCarImagesController } from "@modules/cars/useCases/uploadCarImages/UploadCarImagesController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuth } from "../middlewares/ensureAuth";

const carsRouter = Router();

const uploadCarImage = multer(uploadConfig);

const createCarController = new CreateCarController();
const createCarSpecificationController = new CreateCarSpecificationController();
const listAvailableCarsController = new ListAvailableCarsController();
const uploadCarImageController = new UploadCarImagesController();

carsRouter.post("/", ensureAuth, ensureAdmin, createCarController.handle);

carsRouter.post(
  "/images/:id",
  ensureAuth,
  ensureAdmin,
  uploadCarImage.array("images"),
  uploadCarImageController.handle
);

carsRouter.post(
  "/specifications/:id",
  ensureAuth,
  ensureAdmin,
  createCarSpecificationController.handle
);

carsRouter.get("/", listAvailableCarsController.handle);

export { carsRouter };
