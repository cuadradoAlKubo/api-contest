const { Schema, model } = require('mongoose');

const RoundSchema = new Schema({
    roundNumber: {
        type: Number,
        required: [true, 'El número de ronda es obligatorio']
    },
    lotteryId: {
        type: Schema.Types.ObjectId,
        ref: 'Lottery',
        required: [true, 'El ID del sorteo es obligatorio']
    },
    prizeId: {
        type: Schema.Types.ObjectId,
        ref: 'Prize',
        required: [true, 'El ID del premio es obligatorio']
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'UserByLottery'
    }],
    winners: {
        type: Schema.Types.ObjectId,
        ref: 'UserByLottery'
    }
});

module.exports = model('Round', RoundSchema);
