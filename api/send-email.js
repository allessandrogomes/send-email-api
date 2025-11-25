const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Lista de origens permitidas
const allowedOrigins = ['https://valebytes.com.br', 'https://www.valebytes.com.br'];

module.exports = async function handler(req, res) {
  // Configurar CORS headers baseado na origem da requisição
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { name, phone, email, message } = req.body;

    // Basic validation
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
    return res.status(405).json({ message: "Método não permitido." });
  }
};