import { resolve } from "path";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IEmailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class SendForgotPasswordEmailUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,
    @inject("MailProvider")
    private mailProvider: IEmailProvider
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User not found.");
    }

    const token = uuidV4();
    const expiration_date = this.dateProvider.addHours(3);

    await this.userTokensRepository.create({
      user_id: user.id,
      refresh_token: token,
      expiration_date,
    });

    const emailData = {
      name: user.name,
      link: `${process.env.FORGOT_PASSWORD_EMAIL_URL}?token=${token}`,
    };

    const templatePath = resolve(
      __dirname,
      "../../views/email/forgotPassword.hbs"
    );

    await this.mailProvider.sendEmail(
      email,
      "Recuperação de senha",
      emailData,
      templatePath
    );
  }
}

export { SendForgotPasswordEmailUseCase };
