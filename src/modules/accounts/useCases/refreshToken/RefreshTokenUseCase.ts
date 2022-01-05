import { JwtPayload, sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IPayload extends JwtPayload {
  email: string;
}

interface IResponse {
  token: string;
  refreshToken: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute(refreshToken: string): Promise<IResponse> {
    const {
      tokenSecret,
      tokenExpiresIn,
      refreshTokenSecret,
      refreshTokenExpiresIn,
      refreshTokenExpirationDays,
    } = auth;

    const { sub, email } = verify(refreshToken, refreshTokenSecret) as IPayload;

    if (!sub) {
      throw new AppError("JWT malformed.");
    }

    const user_id = sub;

    const userToken =
      await this.userTokensRepository.findByUserIdAndRefreshToken(
        user_id,
        refreshToken
      );

    if (!userToken) {
      throw new AppError("Refresh token not found.");
    }

    await this.userTokensRepository.deleteById(userToken.id);

    const newRefreshToken = sign({ email }, refreshTokenSecret, {
      subject: sub,
      expiresIn: refreshTokenExpiresIn,
    });

    const expiration_date = this.dateProvider.addDays(
      refreshTokenExpirationDays
    );

    await this.userTokensRepository.create({
      user_id,
      refresh_token: newRefreshToken,
      expiration_date,
    });

    const newToken = sign({}, tokenSecret, {
      subject: user_id,
      expiresIn: tokenExpiresIn,
    });

    return {
      token: newToken,
      refreshToken: newRefreshToken,
    };
  }
}

export { RefreshTokenUseCase };
