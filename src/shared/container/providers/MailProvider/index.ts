import { container } from "tsyringe";

import { IEmailProvider } from "./IMailProvider";
import { EtherealMailProvider } from "./implementations/EtherealMailProvider";
import { SendGridMailProvider } from "./implementations/SendGridMailProvider";

let mailProvider:
  | typeof EtherealMailProvider
  | typeof SendGridMailProvider
  | null = null;

switch (process.env.MAIL_PROVIDER) {
  case "ethereal":
    mailProvider = EtherealMailProvider;
    break;
  case "sendgrid":
    mailProvider = SendGridMailProvider;
    break;
  default:
    break;
}

if (!mailProvider) {
  throw new Error("Mail provider not specified.");
}

container.registerSingleton<IEmailProvider>("MailProvider", mailProvider);
