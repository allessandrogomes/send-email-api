import { transporter } from "./mailer.js";

const allowedOrigins = [
  "https://valebytes.com.br",
  "https://www.valebytes.com.br",
];

export default async function handler(req, res) {
  const origin = req.headers.origin;

  // AQUI: Definir headers CORS ANTES de verificar o método
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Lidar com preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { name, phone, email, message } = req.body;

    if (!name || !phone || !email || !message) {
      return res.status(400).json({
        error: "Campos obrigatórios não preenchidos",
      });
    }

    const result = await transporter.sendMail({
      from: `ValeBytes <${process.env.SMTP_USER}>`,
      to: "contato@valebytes.com.br",
      replyTo: email,
      subject: `Projeto de ${name}`,
      text: `Nome: ${name}
Telefone: ${phone || "Não informado"}
Email: ${email}

Mensagem:
${message}`,
    });

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("MAIL ERROR:", error);
    return res.status(500).json({
      error: "Erro ao enviar e-mail",
    });
  }
}