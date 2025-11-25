const { Resend } = require("resend");
const Cors = require('cors');

const resend = new Resend(process.env.RESEND_API_KEY);

const cors = Cors({
  origin: ['https://valebytes.com.br', 'https://www.valebytes.com.br'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
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
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    const { name, phone, email, message } = req.body;

    try {
      await resend.emails.send({
        from: "ValeBytes <contato@valebytes.com.br>",
        to: "contato@valebytes.com.br",
        reply_to: email,
        subject: `Projeto de ${name}`,
        text: `${message}\n\nTelefone: ${phone}\nEmail: ${email}`
      });

      return res.status(200).json({ message: "Email enviado com sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao enviar o email." });
    }
  } else {
    return res.status(405).json({ message: "Método não permitido." });
  }
};