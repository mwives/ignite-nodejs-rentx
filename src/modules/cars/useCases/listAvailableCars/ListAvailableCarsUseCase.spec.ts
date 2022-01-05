import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;

describe("List cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
  });

  it("should list available cars", async () => {
    const cars: Car[] = [];

    const car1 = await carsRepositoryInMemory.create({
      name: "Batmobile 2018",
      description: "The Batman's car!",
      daily_rate: 300,
      license_plate: "BAT-2018",
      fine_amount: 100,
      brand: "Wayne Enterprises",
      category_id: "Bat123123",
    });

    const car2 = await carsRepositoryInMemory.create({
      name: "Batmobile 1989",
      description: "The Batman's car!",
      daily_rate: 300,
      license_plate: "BAT-1989",
      fine_amount: 100,
      brand: "Wayne Enterprises",
      category_id: "Bat123123",
    });

    cars.push(car1, car2);

    const carsList = await listAvailableCarsUseCase.execute({});

    expect(carsList).toEqual(cars);
  });

  it("should be able to list all available cars by brand", async () => {
    const cars: Car[] = [];

    const car1 = await carsRepositoryInMemory.create({
      name: "Batmobile 2018",
      description: "The Batman's car!",
      daily_rate: 300,
      license_plate: "BAT-2018",
      fine_amount: 100,
      brand: "Wayne Enterprises",
      category_id: "Bat123123",
    });

    const car2 = await carsRepositoryInMemory.create({
      name: "Batmobile 1989",
      description: "The Batman's car!",
      daily_rate: 300,
      license_plate: "BAT-1989",
      fine_amount: 100,
      brand: "Wayne Enterprises",
      category_id: "Bat123123",
    });

    cars.push(car1, car2);

    const carsList = await listAvailableCarsUseCase.execute({
      brand: "Wayne Enterprises",
    });

    expect(carsList).toEqual(cars);
  });

  it("should be able to list all available cars by category_id", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Batmobile 2018",
      description: "The Batman's car!",
      daily_rate: 300,
      license_plate: "BAT-2018",
      fine_amount: 100,
      brand: "Wayne Enterprises",
      category_id: "Bat123456",
    });

    await carsRepositoryInMemory.create({
      name: "Batmobile 1989",
      description: "The Batman's car!",
      daily_rate: 300,
      license_plate: "BAT-1989",
      fine_amount: 100,
      brand: "Wayne Enterprises",
      category_id: "Bat123123",
    });

    const carsList = await listAvailableCarsUseCase.execute({
      category_id: "Bat123456",
    });

    expect(carsList).toEqual([car]);
  });

  it("should be able to list all available cars by name", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Batmobile 2018",
      description: "The Batman's car!",
      daily_rate: 300,
      license_plate: "BAT-2018",
      fine_amount: 100,
      brand: "Wayne Enterprises",
      category_id: "Bat123123",
    });

    await carsRepositoryInMemory.create({
      name: "Batmobile 1989",
      description: "The Batman's car!",
      daily_rate: 300,
      license_plate: "BAT-1989",
      fine_amount: 100,
      brand: "Wayne Enterprises",
      category_id: "Bat123123",
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: "Batmobile 2018",
    });

    expect(cars).toEqual([car]);
  });
});
