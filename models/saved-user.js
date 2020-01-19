const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const SavedUserSchema = new Schema({
    audioUrl: String,
    avatarUrl: String,
    username: String,
}, { collection: 'saved-user-info', versionKey: false });

module.exports = mongoose.model('SavedUser', SavedUserSchema);

