import { Request, Response } from "express";
import { container } from "tsyringe";

import { ReadUserProfileUseCase } from "./ReadUserProfileUseCase";

class ReadUserProfileController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id: userId } = req.user;

    const readUserProfileUseCase = container.resolve(ReadUserProfileUseCase);

    const user = await readUserProfileUseCase.execute(userId);

    return res.json({
      user,
    });
  }
}

export { ReadUserProfileController };
