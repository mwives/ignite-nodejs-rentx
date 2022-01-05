import { ICreateRentalDTO } from "../dtos/ICreateRentalDTO";
import { Rental } from "../infra/typeorm/entities/Rental";

interface IRentalsRepository {
  create({
    car_id,
    user_id,
    expected_return_date,
  }: ICreateRentalDTO): Promise<Rental>;
  findById(rentalId: string): Promise<Rental | undefined>;
  findByUserId(userId: string): Promise<Rental[]>;
  findOpenByCarId(carId: string): Promise<Rental | undefined>;
  findOpenByUserId(userId: string): Promise<Rental | undefined>;
}

export { IRentalsRepository };
