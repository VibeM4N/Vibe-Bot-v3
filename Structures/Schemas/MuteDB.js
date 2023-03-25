const mongoose = require("mongoose");

const MuteSchema = new mongoose.Schema({
  UserID: { type: String, required: true },
  GuildID: { type: String, required: true },
  Duration: { type: Number, required: true },
  Expires: { type: Date, required: true },
});

const MuteModel = mongoose.model('Mute', MuteSchema);

module.exports = MuteModel;