const {Schema, model} = require('mongoose')


const UserByLotterySchema = Schema({
    name: {
        type: String,
        required:[true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    }, 
    lotteryId: {
        type: Schema.Types.ObjectId,
        ref: 'Lottery',
        required: true
    },
    status: {
        type: String,
        default: 'PENDING',
        enum: ['WINNER', 'PENDING']
       
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

UserByLottery.methods.toJSON = function() {
    const { __v, ...userByLottery } = this.toObject();
    return userByLottery
}


module.exports = model('User', UserByLotterySchema);
