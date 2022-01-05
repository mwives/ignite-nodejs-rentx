import dayjs from "dayjs";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/inMemory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let createRentalUseCase: CreateRentalUseCase;

describe("Create rental", () => {
  const dayPlus24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      carsRepositoryInMemory,
      dayjsDateProvider
    );
  });

  it("should create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      id: "123123",
    } as ICreateCarDTO);

    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      user_id: "userId",
      expected_return_date: dayPlus24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not create a new rental if user already rented", async () => {
    const car1 = await carsRepositoryInMemory.create({
      id: "car1Id",
    } as ICreateCarDTO);

    const car2 = await carsRepositoryInMemory.create({
      id: "car2Id",
    } as ICreateCarDTO);

    await createRentalUseCase.execute({
      car_id: car1.id,
      user_id: "sameUserId",
      expected_return_date: dayPlus24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: car2.id,
        user_id: "sameUserId",
        expected_return_date: dayPlus24Hours,
      })
    ).rejects.toEqual(new AppError("User already has a rental."));
  });

  it("should not create a new rental if car is already rented", async () => {
    const car = await carsRepositoryInMemory.create({
      id: "123123",
    } as ICreateCarDTO);

    await createRentalUseCase.execute({
      car_id: car.id,
      user_id: "userId1",
      expected_return_date: dayPlus24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: car.id,
        user_id: "userId2",
        expected_return_date: dayPlus24Hours,
      })
    ).rejects.toEqual(new AppError("Car is already rented."));
  });

  it("should not create a new rental if return time less than 24 hours", async () => {
    await expect(
      createRentalUseCase.execute({
        car_id: "carId",
        user_id: "userId",
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(
      new AppError("Rentals must be at least 24 hour long.")
    );
  });
});
