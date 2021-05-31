const nodemailer = require("nodemailer");

const enviar = (from,umail, text, phone)=>{
    const transporter = nodemailer.createTransport({
        service: 'smartbot.la',
        auth: {
            user: 'soporte@smartbot.la',
            pass: 'soporte2020',
        }
    })

    const mailOption = {
        from : umail,
        to: "soporte@smartbot.la",
        subject: 'contact zone',
        text: `${text} - número de contacto: ${phone}  ` 
    }

    const sendCorreo = transporter.sendMail(mailOption, (err,data)=>{
        if(err) return err;
        if(data) return(data)
    });
    return sendCorreo;
}




module.exports = enviar;