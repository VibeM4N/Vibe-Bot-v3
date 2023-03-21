const { Schema, model } = require("mongoose");

module.exports = model("TicketSetup", new Schema({
    GuildID: String,
    Channel: String,
    Category: String,
    Transciprts: String,
    ModeratorRole: String,
    Everyone: String,
    Description: String,
    Buttons: [String]
}))