import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refreshToken: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UserTokensRepository")
    private usersTokensRepository: IUserTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const {
      tokenSecret,
      tokenExpiresIn,
      refreshTokenSecret,
      refreshTokenExpiresIn,
      refreshTokenExpirationDays,
    } = auth;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or password incorrect.");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Email or password incorrect.");
    }

    const token = sign({}, tokenSecret, {
      subject: user.id,
      expiresIn: tokenExpiresIn,
    });

    const refresh_token = sign({ email }, refreshTokenSecret, {
      subject: user.id,
      expiresIn: refreshTokenExpiresIn,
    });

    const expiration_date = this.dateProvider.addDays(
      refreshTokenExpirationDays
    );

    await this.usersTokensRepository.create({
      user_id: user.id,
      refresh_token,
      expiration_date,
    });

    const response = {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
      refreshToken: refresh_token,
    };

    return response;
  }
}

export { AuthenticateUserUseCase };
