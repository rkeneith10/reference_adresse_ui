import nodemailer from "nodemailer";

export const testAndSendMail = async ({ to, subject, text }: { to: string; subject: string; text: string }) => {

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER!,
      pass: process.env.MAILTRAP_PASS!,
    }
  });

  const info = await transporter.sendMail({
    from: '"Admin Test" <test@example.com>',
    to: to,
    subject: subject,
    text: text,
  });

};

