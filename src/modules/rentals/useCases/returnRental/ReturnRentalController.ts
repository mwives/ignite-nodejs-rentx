import { Request, Response } from "express";
import { container } from "tsyringe";

import { ReturnRentalUseCase } from "./ReturnRentalUseCase";

class ReturnRentalController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id: rental_id } = req.params;

    const returnRentalUseCase = container.resolve(ReturnRentalUseCase);

    const rental = await returnRentalUseCase.execute({ rental_id });

    return res.json({ rental });
  }
}

export { ReturnRentalController };
