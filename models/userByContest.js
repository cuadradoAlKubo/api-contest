const {Schema, model} = require('mongoose')


const UserByContestSchema = Schema({
    name: {
        type: String,
        required:[true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    }, 
    contestId: {
        type: Schema.Types.ObjectId,
        ref: 'Contest',
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

UserByContest.methods.toJSON = function() {
    const { __v, ...userByContest } = this.toObject();
    return userByContest
}


module.exports = model('User', UserByContestSchema);
