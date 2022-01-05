import { getRepository, Repository } from "typeorm";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import {
  ICarsRepository,
  IFindAvailableParams,
} from "@modules/cars/repositories/ICarsRepository";

import { Car } from "../entities/Car";

class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async create({
    id,
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
    specifications,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      id,
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      specifications,
    });

    await this.repository.save(car);

    return car;
  }

  async findById(id: string): Promise<Car | undefined> {
    const car = await this.repository.findOne({ id });

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car | undefined> {
    const car = await this.repository.findOne({ license_plate });

    return car;
  }

  async findAvailable({
    brand,
    category_id,
    name,
  }: IFindAvailableParams): Promise<Car[]> {
    const carsQuery = this.repository
      .createQueryBuilder("cars")
      .where("available = :available", { available: true });

    if (brand) {
      carsQuery.andWhere("brand = :brand", { brand });
    }

    if (category_id) {
      carsQuery.andWhere("category_id = :category_id", { category_id });
    }

    if (name) {
      carsQuery.andWhere("name = :name", { name });
    }

    const cars = await carsQuery.getMany();

    return cars;
  }

  async updateAvailability(id: string, available: boolean): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ available })
      .where("id = :id")
      .setParameters({ id })
      .execute();
  }
}

export { CarsRepository };
