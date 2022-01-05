import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

import { UploadCarImagesUseCase } from "./UploadCarImagesUseCase";

interface IFiles {
  filename: string;
}

class UploadCarImagesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id: car_id } = req.params;
    const images = req.files as IFiles[];

    const uploadCarImagesUseCase = container.resolve(UploadCarImagesUseCase);

    if (!images) {
      throw new AppError("No image provided.");
    }

    const images_name = images.map((file) => file.filename);

    await uploadCarImagesUseCase.execute({ car_id, images_name });

    return res.status(201).send();
  }
}

export { UploadCarImagesController };
