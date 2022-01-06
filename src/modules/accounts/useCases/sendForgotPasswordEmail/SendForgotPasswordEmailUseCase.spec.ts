import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UserTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { EtherealMailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/EtherealMailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordEmailUseCase } from "./SendForgotPasswordEmailUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let userTokensRepositoryInMemory: UserTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let emailProvider: EtherealMailProviderInMemory;
let sendForgotPasswordEmailUseCase: SendForgotPasswordEmailUseCase;

describe("Send Forgot Mail", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    userTokensRepositoryInMemory = new UserTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    emailProvider = new EtherealMailProviderInMemory();

    sendForgotPasswordEmailUseCase = new SendForgotPasswordEmailUseCase(
      usersRepositoryInMemory,
      userTokensRepositoryInMemory,
      dateProvider,
      emailProvider
    );
  });

  it("should send a forgot password email to user", async () => {
    const sendMail = jest.spyOn(emailProvider, "sendEmail");

    await usersRepositoryInMemory.create({
      driver_license: "12345",
      email: "bruce@mail.com",
      name: "Bruce Wayne",
      password: "Bat123",
    });

    await sendForgotPasswordEmailUseCase.execute("bruce@mail.com");

    expect(sendMail).toHaveBeenCalled();
  });

  it("should not send email if user does not exist", async () => {
    await expect(
      sendForgotPasswordEmailUseCase.execute("null@mail.com")
    ).rejects.toEqual(new AppError("User not found."));
  });

  it("should create an user token", async () => {
    const generateTokenMail = jest.spyOn(
      userTokensRepositoryInMemory,
      "create"
    );

    usersRepositoryInMemory.create({
      driver_license: "54321",
      email: "alfred@wayne.com",
      name: "Alfred Pennyworth",
      password: "Bat123",
    });

    await sendForgotPasswordEmailUseCase.execute("alfred@wayne.com");

    expect(generateTokenMail).toBeCalled();
  });
});
