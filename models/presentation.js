const mongoose = require("../src/app/lib/mongoConnection")

const presentationSchema = new mongoose.Schema({

})

module.exports = mongoose.models.Presentation || mongoose.model("Presentation", presentationSchema)