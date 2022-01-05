import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserToken } from "../infra/typeorm/entities/UserToken";

interface IUserTokensRepository {
  create({
    user_id,
    expiration_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserToken>;

  findByRefreshToken(refreshToken: string): Promise<UserToken | undefined>;

  findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<UserToken | undefined>;

  deleteById(id: string): Promise<void>;
}

export { IUserTokensRepository };
