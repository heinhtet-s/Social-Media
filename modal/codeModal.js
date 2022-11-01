const mongoose = require("mongoose");
const codeSchema = mongoose.Schema({
    code: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}
)
const Code = mongoose.model("Code", codeSchema);
module.exports = Code;



