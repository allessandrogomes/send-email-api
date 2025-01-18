require('dotenv').config()
const express = require('express')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors({
    origin: 'https://valebytes.com.br/',
    methods: 'GET,POST',
    allowedHeaders: ['Content-Type']
}))

app.use(bodyParser.json())

app.post('/send-email', async (req, res) => {
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

        res.status(200).json({ message: "Email enviado com sucesso!" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Erro ao enviar o email." })
    }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})