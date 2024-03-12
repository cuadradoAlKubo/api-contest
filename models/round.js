const { Schema, model } = require('mongoose');

const RoundSchema = new Schema({
    roundNumber: {
        type: Number,
        required: [true, 'El número de ronda es obligatorio']
    },
    contestId: {
        type: Schema.Types.ObjectId,
        ref: 'Contest',
        required: [true, 'El ID del sorteo es obligatorio']
    },
    prizeId: {
        type: Schema.Types.ObjectId,
        ref: 'Prize',
        required: [true, 'El ID del premio es obligatorio']
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'UserByContest'
    }],
    winners: {
        type: Schema.Types.ObjectId,
        ref: 'UserByContest'
    }
});

module.exports = model('Round', RoundSchema);
