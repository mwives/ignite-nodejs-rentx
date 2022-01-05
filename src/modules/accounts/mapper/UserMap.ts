import { instanceToInstance } from "class-transformer";

import { IReadUserProfileDTO } from "../dtos/IReadUserProfileDTO";
import { User } from "../infra/typeorm/entities/User";

class UserMap {
  static toDTO({
    id,
    driver_license,
    name,
    email,
    avatar,
    avatar_url,
  }: User): IReadUserProfileDTO {
    const user = instanceToInstance({
      id,
      driver_license,
      name,
      email,
      avatar,
      avatar_url,
    });

    return user;
  }
}

export { UserMap };
