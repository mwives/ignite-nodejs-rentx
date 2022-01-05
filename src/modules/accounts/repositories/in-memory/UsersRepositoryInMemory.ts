import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = [];

  async create({
    name,
    email,
    password,
    driver_license,
    avatar,
  }: ICreateUserDTO): Promise<void> {
    const user = new User();

    Object.assign(user, {
      name,
      email,
      password,
      driver_license,
      avatar,
    });

    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === email);

    return user;
  }

  async findById(userId: string): Promise<User> {
    const user = this.users.find((user) => user.id === userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}

export { UsersRepositoryInMemory };
