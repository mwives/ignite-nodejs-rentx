import { Router } from "express";

import { CreateRentalController } from "@modules/rentals/useCases/createRental/CreateRentalController";
import { ListRentalsByUserController } from "@modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController";
import { ReturnRentalController } from "@modules/rentals/useCases/returnRental/ReturnRentalController";

import { ensureAuth } from "../middlewares/ensureAuth";

const rentalsRouter = Router();

const createRentalController = new CreateRentalController();
const returnRentalController = new ReturnRentalController();
const listRentalsByUserController = new ListRentalsByUserController();

rentalsRouter.post("/", ensureAuth, createRentalController.handle);

rentalsRouter.post("/returns/:id", ensureAuth, returnRentalController.handle);

rentalsRouter.get("/user", ensureAuth, listRentalsByUserController.handle);

export { rentalsRouter };
