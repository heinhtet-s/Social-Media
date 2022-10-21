const jwt = require("jsonwebtoken");
const User = require("../modal/userModal");
const { success, error, validation } = require('../utilis/responseApi');
const asyncHandler = require("express-async-handler")
const protectedRoute = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (err) {
            console.log("geofjgwofe");
            res.status(401).json(error("Unauthorized", 401));   
        }
    }else{
        res.status(401).json(error("Unauthorized", 401));       
    }
    if (!token) {
        res.status(401).json(error("Unauthorized", 401));       
    }
})
module.exports = { protectedRoute };