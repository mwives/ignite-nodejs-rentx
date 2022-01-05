import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarUseCase } from "./CreateCarUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let createCarUseCase: CreateCarUseCase;

describe("Create car", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it("should create a new car", async () => {
    const car = await createCarUseCase.execute({
      name: "Batmobile",
      description: "The Batman's car!",
      daily_rate: 300,
      license_plate: "BAT-1234",
      fine_amount: 100,
      brand: "Wayne Enterprises",
      category_id: "category",
    });

    expect(car).toHaveProperty("id");
  });

  it("should not create a car with existing license plate", async () => {
    await createCarUseCase.execute({
      name: "Batmobile 2016",
      description: "The Batman's car!",
      daily_rate: 300,
      license_plate: "BAT-1234",
      fine_amount: 100,
      brand: "Wayne Enterprises",
      category_id: "category",
    });

    await expect(
      createCarUseCase.execute({
        name: "Batmobile 1984",
        description: "The Batman's car!",
        daily_rate: 300,
        license_plate: "BAT-1234",
        fine_amount: 100,
        brand: "Wayne Enterprises",
        category_id: "category",
      })
    ).rejects.toEqual(
      new AppError("Car with same license plate already exists.")
    );
  });

  it("should create a new car with available true by default", async () => {
    const car = await createCarUseCase.execute({
      name: "Batmobile",
      description: "The Batman's car!",
      daily_rate: 300,
      license_plate: "BAT-1234",
      fine_amount: 100,
      brand: "Wayne Enterprises",
      category_id: "category",
    });

    expect(car.available).toBe(true);
  });
});
