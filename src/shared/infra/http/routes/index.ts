import { Router } from "express";

import { carsRouter } from "./cars.routes";
import { categoriesRouter } from "./categories.routes";
import { passwordRouter } from "./password.routes";
import { rentalsRouter } from "./rentals.routes";
import { sessionsRouter } from "./sessions.routes";
import { specificationsRouter } from "./specifications.routes";
import { usersRouter } from "./users.routes";

const router = Router();

router.use("/", sessionsRouter);
router.use("/cars", carsRouter);
router.use("/categories", categoriesRouter);
router.use("/password", passwordRouter);
router.use("/rentals", rentalsRouter);
router.use("/specifications", specificationsRouter);
router.use("/users", usersRouter);

export { router };
