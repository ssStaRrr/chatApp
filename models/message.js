const mongoose = require("mongoose")

const message = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const Message = mongoose.model("Message", message)

module.exports = Message