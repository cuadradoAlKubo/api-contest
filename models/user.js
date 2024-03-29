const {Schema, model} = require('mongoose')


const UserSchema = Schema({
    name: {
        type: String,
        required:[true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio'],
    },
    role: {
        type: String,
        required: [true],
        default:'USER',
        enum: ['ADMIN', 'USER']
    },
    status: {
        type: Boolean,
        default:true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id
    
    return user
}


module.exports = model('User', UserSchema);