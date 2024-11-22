const mongoose = require("../src/app/lib/mongoConnection")

const userSchema = new mongoose.Schema({
    nickname: String,
    presentations: Array,
})

module.exports = mongoose.models.User || mongoose.model("User", userSchema)