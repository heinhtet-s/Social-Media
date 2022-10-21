const mongoose = require("mongoose");
var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "First Name is required"],
        trim: true,
        text: true,
    },
    last_name: {
        type: String,
        required: [true, "Last Name is required"],
        trim: true,
        text: true,
    },
    last_name: {
        type: String,
        required: [true, "Last Name is required"],
        trim: true,
        text: true,
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        text: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],

    },
    password: {
        type: String,
        required: [true, "password is required"],
        trim: true,
    },
    picture: {
        type: String,
        trim: true,
        default:
            "https://res.cloudinary.com/dmhcnhtng/image/upload/v1643044376/avatars/default_pic_jeaybr.png",
    },
    cover: {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        enum: ["male", "email"],
        required: [true, "gender is required"],
        trim: true,
    },
    bYear: {
        type: Number,
        required: true,
        trim: true,
    },
    bMonth: {
        type: Number,
        required: true,
        trim: true,
    },
    bDay: {
        type: Number,
        required: true,
        trim: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    friends: {
        type: Array,
        default: [],
    },
    following: {
        type: Array,
        default: [],
    },
    followers: {
        type: Array,
        default: [],
    },
    requests: {
        type: Array,
        default: [],
    },
    search: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        },
    ],
    details: {
        bio: {
            type: String,
        },
        otherName: {
            type: String,
        },
        job: {
            type: String,
        },
        workplace: {
            type: String,
        },
        highSchool: {
            type: String,
        },
        college: {
            type: String,
        },
        currentCity: {
            type: String,
        },
        hometown: {
            type: String,
        },
        relationship: {
            type: String,
            enum: ["Single", "In a relationship", "Married", "Divorced"],
        },
        instagram: {
            type: String,
        },
    },
    savedPosts: [
        {
            post: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
            savedAt: {
                type: Date,
                default: new Date(),
            },
        },
    ],
},
    {
        timestamps: true,
    }
)
const User = mongoose.model("User", userSchema);
module.exports = User;
