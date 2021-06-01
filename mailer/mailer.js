const nodemailer = require("nodemailer");

const enviar = async (nombre, email, phone, msg)=>{

    let smtpConfig = {
        host: 'mail.smartbot.la',
        secureConnection: "true",
        port: 465,
        auth: {
            user: "soporte@smartbot.la",
            pass: "soporte2020",
        },
        tls: {
            rejectUnauthorized: false
        }
    }


    let transporter = nodemailer.createTransport(smtpConfig);

    let mailOption = {
        from : `'${nombre}' <${email}>`,
        to: 'soporte@smartbot.la', 
        subject: 'contacto web form',
        text: `phone_user: ${phone} - message: ${msg}`
    }

    const envioCorreo = await transporter.sendMail(mailOption);

    return envioCorreo;
}

module.exports = enviar;