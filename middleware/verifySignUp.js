const { error, validation } = require('../utilis/responseApi');
const User = require('../modal/userModal.js');
const asyncHandler = require('express-async-handler');
checkDuplicatePhoneOrEmail = asyncHandler(async (req, res, next) => {
    console.log(req.body, "ggg");
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (err) {
            res.status(500).json(error(err.message || "Some error occurred while creating the User.", 500));
            return;
        }
        if (user) {
            console.log("ge", user,);
            res.status(400).json(error('User already exists ufeiufwo', 400));
            return;
        } else {
            next();
        }
    });
})

checkUserName = async (req, res, next) => {
    let tempName = req.body.first_name + " " + req.body.last_name;
    console.log(tempName, "gggefjeifwo");
    let loop = false;
    do {
        User.findOne({ username: tempName }).exec((err, user) => {
            if (err) {
                res.status(500).json(error(err.message || "Some error occurred while creating the User.", 500));
                return;
            }
            console.log(err, user, "geowjgeoijfwo");
            if (user) {
                tempName += (+new Date() * Math.random()).toString().substring(0, 7);
                console.log("ge", tempName);
                loop = true;
            } else {
                loop = false;
            }
        })
    } while (loop);
    req.body.username = tempName;
    next();

}


const verifySignUp = {
    checkDuplicatePhoneOrEmail,
    checkUserName
};
module.exports = verifySignUp;
