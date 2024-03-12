const { Schema, model } = require('mongoose')



const PrizeSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    status: {
        type: Boolean,
        default: true
    },
    lotteryId: {
        type: Schema.Types.ObjectId,
        ref: 'Lottery',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    orderToLot:{
        type: Number,
        required: [true, 'El orden es obligatorio']
    },
    image:{
        type: String,
        default: 'no-image.jpg'
    
    },
    winner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },   
    markAsDelivery:{
        type: Boolean,
        default: false
    }

})

PrizeSchema.methods.toJSON = function() {
    const { __v, ...prize } = this.toObject();
    return prize
  }
  

module.exports =  model('Prize', PrizeSchema)