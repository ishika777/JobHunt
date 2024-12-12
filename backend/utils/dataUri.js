const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();
const path = require("path");

const getDataUri = (file) => {
    if(file && file.buffer){
        const extName = path.extname(file?.originalname || "").toString()
        return parser.format(extName, file?.buffer);
    }
}
module.exports = getDataUri;