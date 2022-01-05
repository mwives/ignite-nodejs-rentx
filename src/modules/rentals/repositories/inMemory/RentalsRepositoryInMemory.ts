import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";

import { IRentalsRepository } from "../IRentalsRepository";

class RentalsRepositoryInMemory implements IRentalsRepository {
  rentals: Rental[] = [];

  async create({
    car_id,
    user_id,
    expected_return_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    Object.assign(rental, {
      car_id,
      user_id,
      expected_return_date,
      start_date: new Date(),
    });

    this.rentals.push(rental);

    return rental;
  }

  async findById(rentalId: string): Promise<Rental | undefined> {
    const rental = this.rentals.find((rental) => rental.id === rentalId);

    return rental;
  }

  async findByUserId(userId: string): Promise<Rental[]> {
    const rental = this.rentals.filter((rental) => rental.user_id === userId);

    return rental;
  }

  async findOpenByUserId(userId: string): Promise<Rental | undefined> {
    const rental = this.rentals.find(
      (rental) => rental.user_id === userId && !rental.end_date
    );

    return rental;
  }

  async findOpenByCarId(carId: string): Promise<Rental | undefined> {
    const rental = this.rentals.find(
      (rental) => rental.car_id === carId && !rental.end_date
    );

    return rental;
  }
}

export { RentalsRepositoryInMemory };
