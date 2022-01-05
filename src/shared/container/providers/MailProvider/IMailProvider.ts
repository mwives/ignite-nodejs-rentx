export interface IEmailData {
  name: string;
  link: string;
}

interface IEmailProvider {
  sendEmail(
    to: string,
    subject: string,
    emailData: IEmailData,
    path: string
  ): Promise<void>;
}

export { IEmailProvider };
