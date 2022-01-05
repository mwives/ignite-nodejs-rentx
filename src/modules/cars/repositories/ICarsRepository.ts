import { ICreateCarDTO } from "../dtos/ICreateCarDTO";
import { Car } from "../infra/typeorm/entities/Car";

interface IFindAvailableParams {
  brand?: string;
  category_id?: string;
  name?: string;
}

interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findById(car_id: string): Promise<Car | undefined>;
  findAvailable({
    brand,
    category_id,
    name,
  }: IFindAvailableParams): Promise<Car[]>;
  findByLicensePlate(license_plate: string): Promise<Car | undefined>;
  updateAvailability(car_id: string, available: boolean): Promise<void>;
}

export { ICarsRepository, IFindAvailableParams };
