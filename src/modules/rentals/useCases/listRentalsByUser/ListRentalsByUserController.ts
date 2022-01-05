import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListRentalsByUserUseCase } from "./ListRentalsByUserUseCase";

class ListRentalsByUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id: userId } = req.user;

    const listRentalsByUserUseCase = container.resolve(
      ListRentalsByUserUseCase
    );

    const rentals = await listRentalsByUserUseCase.execute(userId);

    return res.json({ rentals });
  }
}

export { ListRentalsByUserController };
