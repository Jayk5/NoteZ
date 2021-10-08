const mongoose = require('mongoose');
const passpportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    }
});
UserSchema.plugin(passpportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
