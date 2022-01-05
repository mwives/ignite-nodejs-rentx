import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { UserToken } from "@modules/accounts/infra/typeorm/entities/UserToken";

import { IUserTokensRepository } from "../IUserTokensRepository";

class UserTokensRepositoryInMemory implements IUserTokensRepository {
  userTokens: UserToken[] = [];

  async create({
    user_id,
    expiration_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      user_id,
      refresh_token,
      expiration_date,
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  async findByRefreshToken(
    refreshToken: string
  ): Promise<UserToken | undefined> {
    return this.userTokens.find(
      (token) => token.refresh_token === refreshToken
    );
  }

  async findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<UserToken | undefined> {
    return this.userTokens.find(
      (token) =>
        token.user_id === userId && token.refresh_token === refreshToken
    );
  }

  async deleteById(id: string): Promise<void> {
    this.userTokens = this.userTokens.filter((token) => token.id !== id);
  }
}

export { UserTokensRepositoryInMemory };
