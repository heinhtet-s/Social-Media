const express = require("express");
const {uploadImage}=require("../controllers/imageUploadController")
const { protectedRoute } = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/upload-image", uploadImage);
module.exports = router;    