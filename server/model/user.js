const mongoose = require('mongoose');
const MSchema = mongoose.Schema;

const userSchema = new MSchema({
    name: String,
    age: String,
    profession: String
});

module.exports = mongoose.model('User', userSchema);