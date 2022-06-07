const subjectPaidAccepted = 'Realizaste una compra en GoBew!'
const subjectPaidRejected = 'Tu compra en GoBew fue rechazada'
const subjectPaidPending = 'Tu compra en GoBew está pendiente'
const subjectPaidCanceled = 'Tu compra en GoBew fue cancelada'
const subjectNewAccount = 'Bienvenido a GoBew!'
const subjectNewPassword = 'Cambio de contraseña en GoBew'
const subjectNewEmail = 'Confirmación de Email'

const htmlNewEmail =(obj) =>{ 
    const html= `<p><span>Hola ${obj.userFirstName},</span></p>
    <span>Gracias por registrarte en GoBew! Estamos encantados de tenerte a bordo y trataremos de ayudarte lo máximo posible.
    Confirme su correo electrónico ${obj.userEmail} haciendo click en confirmar email.<br /><br /></span>
    <a href="${process.env.URL_SITE}activate/${obj._id}/${obj.hash}/${obj.userEmail}">Confirmar email</a>
    <span>Háganos saber si tiene alguna pregunta, solicitud o comentarios generales simplemente respondiendo a este correo electrónico.</span>
    <p><span>Saludos cordiales,</span><br /><span>GoBew team</span></p>`

    return html;
}


const htmlPaidAccepted = (obj) =>{
    const html = `<p><span>Hola ${obj.userFirstName},</span></p>
    <span>Gracias por realizar tu compra en GoBew! Hemos recibido tu pago y tu pedido está en proceso de envío.
    En caso de que tengas alguna duda o comentario, no dudes en contactarnos.</span>
    <p>El número de su orden es: ${obj.orderId} y será enviado a su dirección.</p>
    <p><span>Dirección de envió: ${obj.addressComment}</span></p>
    <p>Esperamos que lo disfrutes,<br />Gobew team</p></p>
    <p><span>Saludos cordiales,</span><br /><span>GoBew team</span></p>`
    return html;
}


module.exports = {
    subjectPaidAccepted,
    subjectPaidRejected,
    subjectPaidPending,
    subjectPaidCanceled,
    subjectNewAccount,
    subjectNewPassword,
    subjectNewEmail,
    htmlNewEmail
}