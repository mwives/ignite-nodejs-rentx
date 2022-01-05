import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetUserPasswordUseCase {
  constructor(
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByRefreshToken(token);

    if (!userToken) {
      throw new AppError("Invalid token.");
    }

    if (
      this.dateProvider.compareIfBefore(
        userToken.expiration_date,
        this.dateProvider.getTodaysDate()
      )
    ) {
      throw new AppError("Token expired.");
    }

    console.log("token expired");

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError("User not found.");
    }

    console.log("user found");

    user.password = await hash(password, 8);

    await this.usersRepository.create(user);
    await this.userTokensRepository.deleteById(userToken.id);
  }
}

export { ResetUserPasswordUseCase };
