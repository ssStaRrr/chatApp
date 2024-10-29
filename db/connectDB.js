const mongoose = require("mongoose");
require('dotenv').config()

// Connect to MongoDB Atlas using a promise
const connectDB = () => {
    return new Promise((resolve, rejected) => {
        mongoose.connect(process.env.MONGO_URI).then(() => {
            //connection basarili ise bir sonraki then yapisina bu resolve değerini tasiyacak
            resolve("DB connection is successful")
        }).catch((err) => {
            console.log(err)
            rejected(err)
        })
    })
}

module.exports = {
    connectDB
}
