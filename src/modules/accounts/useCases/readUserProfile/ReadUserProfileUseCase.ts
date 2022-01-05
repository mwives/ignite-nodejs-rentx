import { inject, injectable } from "tsyringe";

import { IReadUserProfileDTO } from "@modules/accounts/dtos/IReadUserProfileDTO";
import { UserMap } from "@modules/accounts/mapper/UserMap";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class ReadUserProfileUseCase {
  constructor(
    @inject("UsersRepository")
    private userRepository: IUsersRepository
  ) {}

  async execute(userId: string): Promise<IReadUserProfileDTO> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found.");
    }

    return UserMap.toDTO(user);
  }
}

export { ReadUserProfileUseCase };
