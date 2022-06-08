const subjectOrderEntered = 'Realizaste una compra en GoBew!'
const subjectPaidAccepted = 'Tu compra en GoBew fue aceptado!'
const subjectPaidRejected = 'Tu compra en GoBew fue rechazada'
const subjectPaidPending = 'Tu compra en GoBew está pendiente'
const subjectPaidCanceled = 'Tu compra en GoBew fue cancelada'
const subjectNewAccount = 'Bienvenido a GoBew!'
const subjectNewPassword = 'Cambio de contraseña en GoBew'
const subjectNewEmail = 'Confirmación de Email'

const htmlNewEmail =({userEmail, userFirstName,  link}) =>{ 
    const html= `<p><span>Hola ${userFirstName},</span></p>
    <span>Gracias por registrarte en GoBew! Estamos encantados de tenerte a bordo y trataremos de ayudarte lo máximo posible.
    Confirme su correo electrónico ${userEmail} haciendo click en confirmar email.<br /><br /></span>
    <a href="${link}">Confirmar email</a>
    <span>Háganos saber si tiene alguna pregunta, solicitud o comentarios generales simplemente respondiendo a este correo electrónico.</span>
    <p><span>Saludos cordiales,</span><br /><span>GoBew team</span></p>`

    return html;
}

const orderCart =(cart) => {
    let elements = ''
    cart.forEach(element => {
        elements += `<tr><td>${element.productName} x ${element.productCant}</td><td> $ ${element.productPrice}</td></tr>`
    })
    return elements;
}

const htmlPaidAccepted = (obj) =>{
    
    const html = `<p><span>Hola ${obj.user[0].userFirstName},</span></p>
    <span>Gracias por realizar tu compra en GoBew! Hemos recibido tu pago y tu pedido está en proceso de envío.
    En caso de que tengas alguna duda o comentario, no dudes en contactarnos.</span>
    <p>El número de su orden es: ${obj.orderId} y será enviado a su dirección.</p>
    <p>Compraste:</p>
    <table>${orderCart(obj.cart)}</table>
    <p>Por un total de $ ${obj.orderTotal}</p>
    <p>Esperamos que lo disfrutes,<br />Gobew team</p></p>
    <p><span>Saludos cordiales,</span><br /><span>GoBew team</span></p>`
    return html;
}
const htmlPaidRejected = (obj) =>{
    
    const html = `<p><span>Hola ${obj.user[0].userFirstName},</span></p>
    <span>Su compra nro: ${obj.orderId} fue rechazada.</p>

    <p>Compra cancelada:</p>
    <table>${orderCart(obj.cart)}</table>
    <p>Por un total de $ ${obj.orderTotal}</p>
    <p>Por cualquier duda no dude en contactarnos,</p>
    <p><span>Saludos cordiales,</span><br /><span>GoBew team</span></p>`
    return html;
}
const htmlOrderEntered = (obj) =>{
    // console.log(obj)
    let elements = ''
    obj.cart.forEach(element => {
        elements += `<tr><td>${element.productName} x ${element.productCant}</td><td> $ ${element.productPrice}</td></tr>`
    })
    const html = `<p><span>Hola ${obj.user[0].userFirstName},</span></p>
    <span>Gracias por realizar tu compra en GoBew! 
    En caso de que tengas alguna duda o comentario, no dudes en contactarnos.</span>
    <p>El número de su orden es: ${obj.orderId}.</p>
    <p>Compraste:</p>
    <table>${elements}</table>
    <p>Por un total de $ ${obj.orderTotal}</p>
    <p>Esperamos que lo disfrutes,<br />Gobew team</p></p>
    <p><span>Saludos cordiales,</span><br /><span>GoBew team</span></p>
    `
    // console.log(html)
    return html;
}
// {
//     orderId: new ObjectId("629f69304d989f4c183128a9"),
//     _id: new ObjectId("629f69304d989f4c183128a9"),
//     orderState: 1,
//     orderTotal: 186471,
//     userId: new ObjectId("629a6e92b98b31e4c460864b"),
//     shippingAddressId: null,
//     cart: [
//       {
//         _id: new ObjectId("629f69304d989f4c183128ab"),
//         productId: new ObjectId("6290d8e06655f25f6df9a9f8"),
//         productName: 'Celular ZTEA',
//         productStock: 7,
//         productCant: 2,
//         productPrice: 20001
//       },
//       {
//         _id: new ObjectId("629f69304d989f4c183128ac"),
//         productId: new ObjectId("6290d9a66655f25f6df9a9fc"),
//         productName: 'Celular Xiaomi Redmi Note 10 PRO 8GB + 128 GB Onyx Grey',
//         productStock: 23,
//         productCant: 1,
//         productPrice: 146469
//       }
//     ],
//     user: [
//       {
//         _id: new ObjectId("629a6e92b98b31e4c460864b"),
//         userEmail: 'msmarinip@gmail.com',
//         userPassword: '$2a$10$/9hjkQDPNJAyIo/fWwkyFe8WQGBdw8Af0r1Zv0csC4pm65QW/XTL2',
//         userIsActive: true,
//         userIsAdmin: true,
//         userIsGoogle: false,
//         userFirstName: 'Soledad',
//         userLastName: 'Marini',
//         userIsSuperAdmin: true,
//         hash: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiU29sZWRhZCIsImlhdCI6MTY1NDI4ODAxOCwiZXhwIjoxNjU0Mjk1MjE4fQ.UgVVbLhbKfMT4_fX3CAdt0AgXbUg2deWFf--nRVDioM',
//         userImage: '',
//         userCreationDate: 2022-06-03T20:26:58.217Z,
//         __v: 0
//       }
//     ]
//   }

module.exports = {
    subjectPaidAccepted,
    subjectPaidRejected,
    subjectPaidPending,
    subjectPaidCanceled,
    subjectNewAccount,
    subjectNewPassword,
    subjectNewEmail,
    htmlNewEmail,
    htmlPaidAccepted,
    subjectOrderEntered,
    htmlOrderEntered,
    htmlPaidRejected
}