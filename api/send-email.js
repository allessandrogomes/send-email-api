import { Resend } from "resend";
import Cors from 'cors';

const resend = new Resend(process.env.RESEND_API_KEY);

const cors = Cors({
  methods: ['POST', 'OPTIONS'],
  origin: [
    "http://localhost:3001",
    "https://valebytes.com.br",
    "https://www.valebytes.com.br"
  ]
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  const { name, phone, email, message } = req.body;

  try {
    await resend.emails.send({
      from: "ValeBytes <contato@valebytes.com.br>",
      to: "contato@valebytes.com.br",
      reply_to: email,
      subject: `Projeto de ${name}`,
      text: `${message}\n\nTelefone: ${phone}\nEmail: ${email}`
    });

    return res.status(200).json({ message: "Enviado!" });
  } catch (err) {
    console.error("Erro ao enviar email:", err);
    return res.status(500).json({ message: "Erro ao enviar." });
  }
}