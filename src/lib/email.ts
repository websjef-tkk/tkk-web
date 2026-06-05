import nodemailer from "nodemailer";

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const FROM = process.env.SMTP_FROM ?? "TKK <noreply@tkk.no>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function sendVerificationEmail(
  email: string,
  token: string,
  locale: string
): Promise<void> {
  const url = `${APP_URL}/${locale}/verifiser-epost/bekreft?token=${token}`;

  const isNo = locale === "no";
  const subject = isNo ? "Bekreft e-postadressen din – TKK" : "Verify your email address – TKK";
  const html = isNo
    ? `
      <p>Hei!</p>
      <p>Klikk på lenken nedenfor for å bekrefte e-postadressen din og aktivere kontoen din hos Trondhjems Kajakklubb.</p>
      <p><a href="${url}" style="background:#2D7A8C;color:white;padding:10px 20px;text-decoration:none;border-radius:4px;display:inline-block">Bekreft e-post</a></p>
      <p>Lenken er gyldig i 24 timer.</p>
      <p>Dersom du ikke opprettet denne kontoen, kan du se bort fra denne e-posten.</p>
      <br>
      <p>– Trondhjems Kajakklubb</p>
    `
    : `
      <p>Hello!</p>
      <p>Click the link below to verify your email address and activate your account at Trondhjems Kajakklubb.</p>
      <p><a href="${url}" style="background:#2D7A8C;color:white;padding:10px 20px;text-decoration:none;border-radius:4px;display:inline-block">Verify email</a></p>
      <p>The link is valid for 24 hours.</p>
      <p>If you did not create this account, you can ignore this email.</p>
      <br>
      <p>– Trondhjems Kajakklubb</p>
    `;

  const transport = createTransport();
  await transport.sendMail({ from: FROM, to: email, subject, html });
}
