import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
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

    const result = await resend.emails.send({
      from: "ValeBytes <contato@valebytes.com.br>",
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