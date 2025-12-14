import { transporter } from "./mailer.js";

const allowedOrigins = [
  "https://valebytes.com.br",
  "https://www.valebytes.com.br",
  "http://localhost:3000",
];

export default async function handler(req, res) {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Responde ao preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Somente POST é permitido
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { name, phone, email, message } = req.body;

    if (!name || !phone || !email || !message) {
      return res.status(400).json({
        error: "Campos obrigatórios: to, subject, e html ou text.",
      });
    }

    const result = await transporter.sendMail({
      from: "ValeBytes <${process.env.SMTP_USER}>",
      to: "contato@valebytes.com.br",
      reply_to: email,
      subject: `Projeto de ${name}`,
      text: `Nome: ${name}\nTelefone: ${
        phone || "Não informado"
      }\nEmail: ${email}\n\nMensagem:\n${message}`,
    });

    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Erro ao enviar e-mail",
    });
  }
}
