const asyncHanlder = require('express-async-handler');
const User = require('../modal/userModal.js');
var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const generateToken = require('../config/generateToken.js');
const { success, error, validation } = require('../utilis/responseApi');
const { validationResult } = require('express-validator/check');
const { sendVerificationEmail } = require('../utilis/mailer.js');
const User = require('../modal/userModal.js');
exports.registerUser = asyncHanlder(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(validation(errors.array(), 422));
    }
    let { first_name, last_name, username, email, password, gender, bYear, bMonth, bDay } = req.body;
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const userData = new User({
        username, first_name, last_name,
        email, password, gender, bYear, bMonth, bDay
    });
    // console.log(username);
    userData.save(userData).then(data => {
        const token = generateToken(data._id);
        const url = `${process.env.BASE_URL}/activate/${token}`;
        sendVerificationEmail(data.email, data.username, url);
        console.log("gefwf", { ...data, token });
        return res.status(200).json(success('User created successfully', {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            picture: data.picture,
            token,
            verified: data.verified,
        }, 200));
    }).catch(err => {
        console.log(err);
        return res.status(400).json(error(err.message || "Some error occurred while creating the User.", 400));
    })
}
);
exports.searchByEmail= asyncHanlder(async (req, res) => {
const {email}=req.body;
 const user = await User.findOne({email}).select("-password");
 if(!user){
    return res.status(400).json(error( "User Not Found", 400));
 }
 return res.status(200).json(success("Successfully fine your account",{
    id: user?._id,
    email: user?.email,
    picture: user?.picture
 }));
}
);
exports.activateAccount = asyncHanlder(async (req, res) => {
    const { token } = req.body;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if(req.user._id !== user.id ){
        return res.status(400).json(error('You do not have access to verify this account', 400));
    }
    const check = await User.findById(user.id);
    if (!check) {
        return res.status(400).json(error('User not found', 400));
    } else if (check.verified === true) {
        return res.status(400).json(error('User already verified', 400));
    } else {
        await User.findByIdAndUpdate(user.id, { verified: true });
        return res.status(200).json(success('User verified successfully', null, 200));
    }
});
exports.passwordResendCode = asyncHanlder(async (req, res) => {
     const user= await User.findById(req.body.id);
     if(!user){
        return res.status(400).json(error( "User Not Found", 400));
     }
    const url = `${process.env.BASE_URL}/activate/${token}`;
    sendVerificationEmail(user.email, user.username, code);
    return res.status(200).json(success('Send Email Verification Successfully',null, 200));
});
exports.resendEmailVerification = asyncHanlder(async (req, res) => {
    const token = generateToken(req.user._id);
    if(req.user.verified){
        return res.status(400).json(error( "This user is already verified", 400));
    }
    const url = `${process.env.BASE_URL}/activate/${token}`;
    sendVerificationEmail(req.user.email, req.user.username, url);
    return res.status(200).json(success('Send Email Verification Successfully',null, 200));
});
exports.login = asyncHanlder(async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        
        return res.status(400).json(error('User not found', 400));
    }
    const check = bcrypt.compare(password, user.password);
    if (check) {
        const token = generateToken(user._id);
        return res.status(200).json(success('User logged in successfully', {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            picture: user.picture,
            token,
            verified: user.verified,
        }, 200));
    } else {
        return res.status(400).json(error('Invalid email or password', 400));
    }

});


