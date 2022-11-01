const asyncHanlder = require('express-async-handler');
const Code=require('../modal/codeModal.js')
const cloudinary=require("cloudinary");
cloudinary.config({ 
    cloud_name: 'dgkhtbgvu', 
    api_key: '387515675738275', 
    api_secret: 'gkn1u0huyCNOMK2Mo6NyLEzjB-8' 
  });
const { success, error, validation } = require('../utilis/responseApi');
exports.uploadImage = asyncHanlder(async (req, res) => {
    const {path}=req.body;
    let files=Object.values(req.files).flat().length;
    let images=[];
    for(const file of files){
        const url = await uploadToCloudinary(file,path);
        images.push(url);
    }
    res.json(images);

})
  const uploadToCloudinary=async(file,paths)=>{
    return new Promise((resolve)=>{
        cloudinary.v2.uploader(file.tempFilePath,
        {
            folder: path
        }, (err,res)=>{
            if(err){
                removeTmp(file.tempFilePath);
                return res.status(400).json(error( "Too large file size", 400));
            }
            resolve({
                url: res.secure_url,
            })
        })});

    }
const removeTmp=(path)=>{
    fs.unlink(path,(err)=>{
        if(err) throw err
    })
};





