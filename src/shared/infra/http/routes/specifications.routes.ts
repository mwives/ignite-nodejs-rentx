import { Router } from "express";

import { CreateSpecificationController } from "@modules/cars/useCases/createSpecification/CreateSpecificationController";
import { ensureAuth } from "@shared/infra/http/middlewares/ensureAuth";

import { ensureAdmin } from "../middlewares/ensureAdmin";

const specificationsRouter = Router();

const createSpecificationController = new CreateSpecificationController();

specificationsRouter.post(
  "/",
  ensureAuth,
  ensureAdmin,
  createSpecificationController.handle
);

export { specificationsRouter };
