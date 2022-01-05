import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateUserAvatarUseCase } from "@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarUseCase";
import { AppError } from "@shared/errors/AppError";

class UpdateUserAvatarController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const avatarFile = req.file?.filename;

    if (!avatarFile) {
      throw new AppError("Avatar file required.");
    }

    const updateUserAvatarUseCase = container.resolve(UpdateUserAvatarUseCase);

    await updateUserAvatarUseCase.execute({ userId: id, avatarFile });

    return res.status(204).send();
  }
}

export { UpdateUserAvatarController };
