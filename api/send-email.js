const nodemailer = require('nodemailer')

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { name, phone, email, message } = req.body

        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        try {
            await transporter.sendMail({
                from: `${name} <contato@valebytes.com.br>`,
                to: "contato@valebytes.com.br",
                subject: `Projeto de ${name}`,
                text: `${message}\n\n${phone}\n\n${email}`
            })

            return res.status(200).json({ message: "Email enviado com sucesso!" })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: "Erro ao enviar o email." })
        }
    } else {
        return res.status(405).json({ message: "Método não permitido." })
    }
}