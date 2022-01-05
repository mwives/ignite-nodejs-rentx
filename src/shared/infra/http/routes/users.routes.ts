import { Router } from "express";
import multer from "multer";

import uploadConfig from "@config/upload";
import { CreateUserController } from "@modules/accounts/useCases/createUser/CreateUserController";
import { ReadUserProfileController } from "@modules/accounts/useCases/readUserProfile/ReadUserProfileController";
import { UpdateUserAvatarController } from "@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController";
import { ensureAuth } from "@shared/infra/http/middlewares/ensureAuth";

const usersRouter = Router();

const uploadAvatar = multer(uploadConfig);

const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();
const readUserProfileController = new ReadUserProfileController();

usersRouter.post("/", createUserController.handle);

usersRouter.get("/me", ensureAuth, readUserProfileController.handle);

usersRouter.patch(
  "/avatar",
  ensureAuth,
  uploadAvatar.single("avatar"),
  updateUserAvatarController.handle
);

export { usersRouter };
