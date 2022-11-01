const { success, error, validation } = require('../utilis/responseApi');
const asyncHandler = require("express-async-handler")
const imageUploadMiddleware = asyncHandler(async (req, res, next) => {
console.log(req.files);
if(!req.files || Object.values(req.files).flat().length === 0 ){
 return res.status(400).json(error( "No File Upload", 400));
}
let files= Object.values(req.files).flat();
if(
 files.mimet_type !== "imgae/jpeg" &&
 files.mimet_type !== "imgae/png" &&
 files.mimet_type !== "imgae/gif" &&
 files.mimet_type !== "imgae/webp" 
){
    removeTmp(files.tempFilePath);
 return res.status(400).json(error( "Unsupported format", 400));
}
if(files.size> 1024 * 1024  ){
    removeTmp(files.tempFilePath);
 return res.status(400).json(error( "Too large file size", 400));
}
next();
});
const removeTmp=(path)=>{
    fs.unlink(path,(err)=>{
        if(err) throw err
    })
};
module.exports={imageUploadMiddleware}