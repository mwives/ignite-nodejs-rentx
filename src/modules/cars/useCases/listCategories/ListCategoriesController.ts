import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListCategoriesUseCase } from "@modules/cars/useCases/listCategories/ListCategoriesUseCase";

class ListCategoriesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const listCategoriesUseCase = container.resolve(ListCategoriesUseCase);

    const categories = await listCategoriesUseCase.execute();

    return res.json({ categories });
  }
}

export { ListCategoriesController };
