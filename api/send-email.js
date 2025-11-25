import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const allowedOrigins = [
    "http://localhost:3001",
    "https://valebytes.com.br",
    "https://www.valebytes.com.br"
];

export default async function handler(req, res) {
    const origin = req.headers.origin;

    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", origin || "*"); 
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        return res.status(200).end();
    }

    if (!allowedOrigins.includes(origin)) {
        return res.status(403).json({ message: "Origin não permitida." });
    }

    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method !== "POST") {
        return res.status(405).end();
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
        return res.status(500).json({ message: "Erro ao enviar." });
    }
}
