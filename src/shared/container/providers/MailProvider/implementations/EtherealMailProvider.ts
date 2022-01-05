import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";
import { injectable } from "tsyringe";

import { IEmailProvider } from "../IMailProvider";

interface IEmailData {
  name: string;
  link: string;
}

@injectable()
class EtherealMailProvider implements IEmailProvider {
  private client: Transporter;

  constructor() {
    nodemailer
      .createTestAccount()
      .then((account) => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        this.client = transporter;
      })
      .catch((err) => console.error(err));
  }

  async sendEmail(
    to: string,
    subject: string,
    emailData: IEmailData,
    path: string
  ): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString("utf-8");
    const templateParse = handlebars.compile(templateFileContent);
    const templateHTML = templateParse(emailData);

    const msg = await this.client.sendMail({
      to,
      from: "Rentx <noreply@rentx.com>",
      subject,
      html: templateHTML,
    });

    console.log(`Message sent: ${msg.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(msg)}`);
  }
}

export { EtherealMailProvider };
