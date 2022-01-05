import { v4 as uuid } from "uuid";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { AppError } from "@shared/errors/AppError";

import { ICarsRepository, IFindAvailableParams } from "../ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create({
    id: carId,
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    let id = carId;

    if (!carId) {
      id = uuid();
    }

    Object.assign(car, {
      id,
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
    });

    this.cars.push(car);

    return car;
  }

  async findByLicensePlate(licensePlate: string): Promise<Car | undefined> {
    const car = this.cars.find((car) => car.license_plate === licensePlate);

    return car;
  }

  async findById(car_id: string): Promise<Car | undefined> {
    const car = this.cars.find((car) => car.id === car_id);

    return car;
  }

  async findAvailable({
    brand,
    category_id,
    name,
  }: IFindAvailableParams): Promise<Car[]> {
    const cars = this.cars.filter((car) => {
      if (car.available) {
        if (!brand && !category_id && !name) {
          return car;
        }

        const carBrand = car.brand === brand;
        const carCategory = car.category_id === category_id;
        const carName = car.name === name;

        return carBrand || carCategory || carName;
      }

      return [];
    });

    return cars;
  }

  async updateAvailability(carId: string, available: boolean): Promise<void> {
    const carIndex = this.cars.findIndex((car) => car.id === carId);

    if (carIndex === -1) {
      throw new AppError("Car not found.", 404);
    }

    this.cars[carIndex].available = available;
  }
}

export { CarsRepositoryInMemory };
