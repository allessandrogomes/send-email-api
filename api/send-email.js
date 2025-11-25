const { Resend } = require("resend");
const Cors = require('cors');

const resend = new Resend(process.env.RESEND_API_KEY);

const cors = Cors({
  origin: ['https://valebytes.com.br', 'https://www.valebytes.com.br'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
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

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    await runMiddleware(req, res, cors);
    return res.status(200).end();
  }

  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    const { name, phone, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: "Nome, email e mensagem são obrigatórios." 
      });
    }

    try {
      await resend.emails.send({
        from: "ValeBytes <contato@valebytes.com.br>",
        to: "contato@valebytes.com.br",
        reply_to: email,
        subject: `Projeto de ${name}`,
        text: `Nome: ${name}\nTelefone: ${phone || 'Não informado'}\nEmail: ${email}\n\nMensagem:\n${message}`
      });

      return res.status(200).json({ message: "Email enviado com sucesso!" });
    } catch (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ message: "Erro ao enviar o email." });
    }
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://valebytes.com.br');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(405).json({ message: "Método não permitido." });
  }
};