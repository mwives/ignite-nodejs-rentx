import { CarImage } from "../infra/typeorm/entities/CarImage";

interface ICreateCarImagesParams {
  car_id: string;
  image_name: string;
}

interface ICarImagesRepository {
  create({ car_id, image_name }: ICreateCarImagesParams): Promise<CarImage>;
}

export { ICarImagesRepository, ICreateCarImagesParams };
