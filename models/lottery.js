const { Schema, model } = require('mongoose')



const LotterySchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    },
    rounds: {
        type: Number,
        default: 1
    },
    lotteryDate: {
        type: Date,
        required: [true, 'La fecha del sorteo es obligatoria']
    },
    prizes: [{
        type: Schema.Types.ObjectId,
        ref: 'Prize'
    }],
})

LotterySchema.methods.toJSON = function() {
  const { __v, ...lottery } = this.toObject();
  return lottery
}

module.exports =  model('Lottery', LotterySchema)