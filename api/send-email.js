const nodemailer = require("nodemailer");
const cors = require("cors");

module.exports = async (req, res) => {
  // === CORS manual para garantir ===
  res.setHeader("Access-Control-Allow-Origin", "https://valebytes.com.br");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // === Responder preflight OPTIONS ===
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // === Apenas POST segue ===
  if (req.method === "POST") {
    const { name, phone, email, message } = req.body;

    try {
      await resend.emails.send({
        from: "ValeBytes <contato@valebytes.com.br>",
        to: "contato@valebytes.com.br",
        reply_to: email,
        subject: `Projeto de ${name}`,
        text: `Nome: ${name}\nTelefone: ${
          phone || "Não informado"
        }\nEmail: ${email}\n\nMensagem:\n${message}`,
      });

      return res.status(200).json({ message: "Email enviado com sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao enviar o email." });
    }
  }

  return res.status(405).json({ message: "Método não permitido." });
};
