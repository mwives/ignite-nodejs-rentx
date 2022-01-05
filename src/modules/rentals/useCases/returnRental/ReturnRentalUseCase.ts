import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  rental_id: string;
}

@injectable()
class ReturnRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ rental_id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(rental_id);

    if (!rental) {
      throw new AppError("Rental not found.", 404);
    }

    const car = await this.carsRepository.findById(rental.car_id);

    if (!car) {
      throw new AppError("Car not found.", 404);
    }

    const dateNow = this.dateProvider.getTodaysDate();

    const minimumDaily = 1;
    let daily = this.dateProvider.getDaysDiff(rental.start_date, dateNow);

    if (daily <= 0) {
      daily = minimumDaily;
    }

    const delayDays = this.dateProvider.getDaysDiff(
      dateNow,
      rental.expected_return_date
    );

    let totalAmount = 0;

    if (delayDays > 0) {
      const totalFine = delayDays * car.fine_amount;
      totalAmount += totalFine;
    }

    totalAmount += daily * car.fine_amount;

    rental.end_date = this.dateProvider.getTodaysDate();
    rental.total = totalAmount;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailability(car.id, true);

    return rental;
  }
}

export { ReturnRentalUseCase };
