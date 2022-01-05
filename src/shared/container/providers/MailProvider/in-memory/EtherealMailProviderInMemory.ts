import { IEmailProvider } from "../IMailProvider";

interface IEmailData {
  name: string;
  link: string;
}

class EtherealEmailProviderInMemory implements IEmailProvider {
  messages: unknown[] = [];

  async sendEmail(
    to: string,
    subject: string,
    emailData: IEmailData,
    path: string
  ): Promise<void> {
    this.messages.push({
      to,
      subject,
      emailData,
      path,
    });
  }
}

export { EtherealEmailProviderInMemory };
