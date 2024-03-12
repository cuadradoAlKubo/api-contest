const { Schema, model } = require('mongoose')



const ContestSchema = Schema({
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
    contestDate: {
        type: Date,
        required: [true, 'La fecha del sorteo es obligatoria']
    },
    prizes: [{
        type: Schema.Types.ObjectId,
        ref: 'Prize'
    }],
})

ContestSchema.methods.toJSON = function() {
  const { __v, ...contest } = this.toObject();
  return contest
}

module.exports =  model('Contest', ContestSchema)