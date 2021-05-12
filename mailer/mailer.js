const nodemailer = require("nodemailer");

const enviar = (from,umail,subject, text, phone)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'smartbot@smartbot.la',
            pass: '123456',
        }
    })

    const mailOption = {
        from : `'${from}' - '<${umail}>'`,
        to: "smartbot@smartbot.la",
        subject,
        text: `${text} - número de contacto: ${phone}  ` 
    }

    const sendCorreo = transporter.sendMail(mailOption, (err,data)=>{
        if(err) return err;
        if(data) return(data)
    });
    return sendCorreo;
}

module.exports = enviar;