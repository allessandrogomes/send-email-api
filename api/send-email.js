const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const allowedOrigins = [
  'https://valebytes.com.br', 
  'https://www.valebytes.com.br'
];

module.exports = async function handler(req, res) {
  const origin = req.headers.origin;
  
  // Headers CORS
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight por 24h
  res.setHeader('Vary', 'Origin');

  // Preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).json({
      message: 'Preflight OK'
    });
  }

  if (req.method === 'POST') {
    try {
      const { name, phone, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ 
          message: "Nome, email e mensagem são obrigatórios." 
        });
      }

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
  }

  return res.status(405).json({ message: "Método não permitido." });
};