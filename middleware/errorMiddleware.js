const { error, validation } = require('../utilis/responseApi');
const notFound = (req, res, next) => {
    // const error = new Error(``);
    res.status(404).json(error(`Not Found - ${req.originalUrl}`, 404));
    return;
};
module.exports = { notFound };