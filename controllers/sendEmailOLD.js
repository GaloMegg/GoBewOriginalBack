const nodemailer = require("nodemailer")
const { CODE } = process.env
const sendEmail1 = async (req,res,) => {
    try {
        const {userEmail, userFirstName, solicitud} = req.body
        mailOptions = ""
        if (!solicitud || (solicitud !== "Compra realizada" && solicitud !== "validacion de mail" && solicitud !== "Cambio de contraseña")) return res.status(404).send("Necesito una solicitud de mail valida")
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            post: 465,
            secure: true,
            auth: {
                user: "gobeworiginal@gmail.com",
                pass: process.env.CODE
            }
        })
        if (solicitud === "Compra realizada") {
            mailOptions = {
                from: "Remitente",
                to: adminMail,
                subject: "Hemos recibido tu pedido en GoBew!",
                html: `
                <p>Hola ${name},</p>
                <p>Su pago se ha completado y su compra (${pedido}) a ${adminName} está en camino. El número de su orden es: ${numeroDePedido} y será enviado a su dirección.</p>
                <p><span>Dirección de envió: ${direccion}</span></p>
                <p>Esperamos que lo disfrutes,<br />Gobew team</p>
                `
            }
        }
        if (solicitud === "validacion de mail") {
            mailOptions = {
                from: "Remitente",
                to: userEmail,
                subject: "Confirmación de Email",
                html: `
                <p><span>Hola ${userFirstName},</span></p>
                <span>Gracias por registrarte en GoBew! Estamos encantados de tenerte a bordo y trataremos de ayudarte lo máximo posible.
                Confirme su correo electrónico ${userEmail} haciendo click en confirmar email.<br /><br /></span>
                <a href="https://developer.mozilla.org/es/docs/Web/HTML/Element/a">Confirmar email</a>
                <span>Háganos saber si tiene alguna pregunta, solicitud o comentarios generales simplemente respondiendo a este correo electrónico.</span>
                <p><span>Saludos cordiales,</span><br /><span>GoBew team</span></p>
                `
            }
        }
        if (solicitud === "Cambio de contraseña") {
            mailOptions = {
                from: "Remitente",
                to: adminMail,
                subject: "Cambio de contraseña",
                html: `<p>Hola ${name}</p>
                <p>¿Usted desea cambiar su contraseña?</p>
                <p>Si usted solicito un cambio de contraseña para el usuario ${adminName}, clickee en cambiar contraseña, de lo contrario respóndanos este mail por favor.</p>
                <a href="https://www.youtube.com/watch?v=KjheexBLY4A">Cambiar contraseña.</a>
                <p>Saludos cordiales,</p>
                <p>GoBew Team.</p>`
            }
        }
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).json({
                    ok: false,
                    msg: "huubo un error",
                    err: error
                });
            } else {
                console.log("email enviado")
                res.status(201).json({
                    ok: true,
                    msg: "mensaje enviado"});
            }
        })
    } catch (e) {
        console.log(e)
    }
}


const emailSender = async (subject, html ) =>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        post: 465,
        secure: false,
        auth: {
            user: "gobeworiginal@gmail.com",
            pass: process.env.CODE
        },
        tls: {
            rejectUnauthorized: false
        }
        })
        mailOptions = {
            from: "Remitente",
            to: userEmail,
            subject: subject,
            html: html
        }
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // console.log("email no enviado")
                // console.log(error)
                return resMail= {
                    ok: false,
                    msg: "hubo un error",
                    err: error
                }
            } else {
                // console.log("email enviado")
                return resMail = {
                    
                    ok: true,
                    msg: "mensaje enviado"};
            }
        })
}


const loginActivateMail = async (obj) => {
    if(obj.userIsGoogle) return {};
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        post: 465,
        secure: false,
        auth: {
            user: "gobeworiginal@gmail.com",
            pass: process.env.CODE
        },
        tls: {
            rejectUnauthorized: false
        }
        })
        
        // console.log('entro a enviar mail')
        mailOptions = {
            from: "Remitente",
            to: obj.userEmail,
            subject: "Confirmación de Email",
            html: `
            <p><span>Hola ${obj.userFirstName},</span></p>
            <span>Gracias por registrarte en GoBew! Estamos encantados de tenerte a bordo y trataremos de ayudarte lo máximo posible.
            Confirme su correo electrónico ${obj.userEmail} haciendo click en confirmar email.<br /><br /></span>
            <a href="${process.env.URL_SITE}activate/${obj._id}/${obj.hash}/${obj.userEmail}">Confirmar email</a>
            <span>Háganos saber si tiene alguna pregunta, solicitud o comentarios generales simplemente respondiendo a este correo electrónico.</span>
            <p><span>Saludos cordiales,</span><br /><span>GoBew team</span></p>
            `
        }
        // console.log(mailOptions);
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // console.log("email no enviado")
                // console.log(error)
                return resMail= {
                    ok: false,
                    msg: "hubo un error",
                    err: error
                }
            } else {
                // console.log("email enviado")
                return resMail = {
                    
                    ok: true,
                    msg: "mensaje enviado"};
            }
        })

}

module.exports = {
    sendEmail1,
    loginActivateMail,
    emailSender
}