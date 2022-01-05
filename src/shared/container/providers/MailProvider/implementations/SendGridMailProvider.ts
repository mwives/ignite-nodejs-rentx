import fs from "fs";
import handlebars from "handlebars";
import { injectable } from "tsyringe";

import sgMail, { MailDataRequired } from "@sendgrid/mail";

import { IEmailData, IEmailProvider } from "../IMailProvider";

@injectable()
class SendGridMailProvider implements IEmailProvider {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
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

    const msg: MailDataRequired = {
      from: `Rentx <${process.env.EMAIL_SENDER_ADDRESS as string}>`,
      to,
      subject,
      html: templateHTML,
    };

    await sgMail.send(msg);
  }
}

export { SendGridMailProvider };
