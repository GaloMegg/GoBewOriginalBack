
const objCarritoToReturn = (objOrder, productsDB) => {
    console.log(1, objOrder, productsDB)
    return {
        orderId : objOrder._id,
        _id : objOrder._id,
        orderState : objOrder.orderState,
        orderTotal : objOrder.orderTotal,
        userId : objOrder.userId,
        shippingAddressId : objOrder.shippingAddressId,
        cart : objOrder.cart.map(item => {
            return {
                _id : item._id,
                productId : item.productId,
                productName: productsDB.filter(product => product._id.toString() === item.productId.toString())[0].productName,
                productStock: productsDB.filter(product => product._id.toString() === item.productId.toString())[0].productStock,
                productCant : item.productCant,
                productPrice : item.productPrice,
                images: productsDB.filter(product => product._id.toString() === item.productId.toString())[0].images,
            }
        }),
        user: objOrder.user 
    }
}


module.exports = {
    objCarritoToReturn
}



    // const obj = {
    //     orderId : order[0]._id,
    //     _id : order[0]._id,
    //     orderState : order[0].orderState,
    //     orderTotal : order[0].orderTotal,
    //     userId : order[0].userId,
    //     shippingAddressId : order[0].shippingAddressId,
    //     cart : order[0].cart.map(item => {
    //         return {
    //             _id : item._id,
    //             productId : item.productId,
    //             productName: productsDB.filter(product => product._id.toString() === item.productId.toString())[0].productName,
    //             productStock: productsDB.filter(product => product._id.toString() === item.productId.toString())[0].productStock,
    //             productCant : item.productCant,
    //             productPrice : item.productPrice,
    //             images: productsDB.filter(product => product._id.toString() === item.productId.toString())[0].images,
    //             // images: productsImage?.filter(image => image?.productId?.toString() === item.productId.toString())[0]
                
    //         }
    //     })
    // }
  


    //CARRITO QUE VIENE DEL FRONT 
    /**
{
    userId: '629a6e92b98b31e4c460864b',
    orderTotal: 186471,
    shippingAddressId: '',
    cart: [
      {
        _id: '6290d8e06655f25f6df9a9f8',
        quantity: 2,
        productPrice: 20001,
        productName: 'Celular ZTEA'
      },
      {
        _id: '6290d9a66655f25f6df9a9fc',
        quantity: 1,
        productPrice: 146469,
        productName: 'Celular Xiaomi Redmi Note 10 PRO 8GB + 128 GB Onyx Grey'
      }
    ]
  }
   */