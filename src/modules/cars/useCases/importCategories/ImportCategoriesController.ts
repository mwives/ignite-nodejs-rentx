import { Request, Response } from "express";
import { container } from "tsyringe";

import { ImportCategoriesUseCase } from "@modules/cars/useCases/importCategories/ImportCategoriesUseCase";
import { AppError } from "@shared/errors/AppError";

class ImportCategoriesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { file } = req;

    const importCategoriesUseCase = container.resolve(ImportCategoriesUseCase);

    if (!file) {
      throw new AppError("File is required.");
    }

    await importCategoriesUseCase.execute(file);

    return res.status(201).send();
  }
}

export { ImportCategoriesController };
