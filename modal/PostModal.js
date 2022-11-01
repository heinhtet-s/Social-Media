const mongoose = require("mongoose");
const {ObjectId}=mongoose.Schema;
const postSchema = mongoose.Schema({
    type: {
type: String,
eum: ["profilePicture","cover",null],
default: null
    },
    text: {
        type: String,
    },
    images: {
        type: Array
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    background: {
        type: String
    },
    comments: [
        {
            comment:    {
                type:String
            },
            image: {
                type: String
            },
            commentBy:{
                type: ObjectId,
                ref: "User"
            },
            commentAt: {
                type: Date,
                default: new Date(),
            }
        }
    ]
}
)
const Post = mongoose.model("Post", postSchema);
module.exports = Post;