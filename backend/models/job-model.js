const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    requirements : [{
        type : String,
    }],
    experienceLevel : {
        type : Number,
        required : true
    },
    salary : {
        type : Number,
        required : true,
    },
    location : {
        type : String,
        required : true,
    },
    jobType : {
        type : String,
        required : true,
    },
    position : {
        type : String,
        required : true,
    },
    company : {type : mongoose.Schema.Types.ObjectId, ref : "Company", required : true},
    createdBy : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true},
    applications : [
        {
            type : mongoose.Schema.Types.ObjectId, 
            ref : "Application"
        }
    ]

}, {timestamps : true})

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
