import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  car_id: string;
  user_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({
    car_id,
    user_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const rentalMinimumHour = 24;

    const hasUserAlreadyRented = await this.rentalsRepository.findOpenByUserId(
      user_id
    );

    if (hasUserAlreadyRented) {
      throw new AppError("User already has a rental.");
    }

    const isCarAlreadyRented = await this.rentalsRepository.findOpenByCarId(
      car_id
    );

    if (isCarAlreadyRented) {
      throw new AppError("Car is already rented.");
    }

    const rentalTimeDifference = this.dateProvider.getHoursDiff(
      this.dateProvider.getTodaysDate(),
      expected_return_date
    );

    if (rentalTimeDifference < rentalMinimumHour) {
      throw new AppError("Rentals must be at least 24 hour long.");
    }

    const rental = await this.rentalsRepository.create({
      car_id,
      user_id,
      expected_return_date,
    });

    await this.carsRepository.updateAvailability(car_id, false);

    return rental;
  }
}

export { CreateRentalUseCase };
