const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const companySchema = new Schema({
    name : {
        type : String,
        required : true,
        unique : true,
    },
    descrition : {
        type : String,
    },
    website : {
        type : String,
    },
    location : {
        type : String,
    },
    logo : {
        type : String,
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Company",
        required : true,
    }
}, {timestamps : true})

const Company = mongoose.model("Company", companySchema);

module.exports = Company;