const {Schema, model} = require('mongoose')


const UserByContestSchema = Schema({
    discordUser: {
        type: String,
        required:[true, 'El usuario de discord es obligatorio']
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

UserByContestSchema.methods.toJSON = function() {
    const { __v, ...userByContest } = this.toObject();
    return userByContest
}


module.exports = model('UserByContest', UserByContestSchema);
