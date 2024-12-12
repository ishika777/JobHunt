const Company = require("../models/company-model");
const getDataUri = require("../utils/dataUri");
const cloudinary = require("../utils/cloudinary");

module.exports.registerCompany = async (req, res) => {
    try {
        const {companyName} = req.body;
        if(!companyName){
            return res.status(400).json({
                message : "Company name is required",
                success : false
            });
        };

        let company = await Company.findOne({name : companyName});
        if(company){
            return res.status(400).json({
                message : "You can't register same ocmpany again",
                success : false
            });
        }

        company = await Company.create({
            name : companyName,
            userId : req.id
        })

        return res.status(201).json({
            message : "Company registered successfully",
            company,
            success : true
        });

    } catch (error) {
        console.log(error)
    }
}

module.exports.getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({userId})    
        if(!companies){
            return res.status(404).json({
                message : "Company not found",
                success : false
            });
        }
        return res.status(200).json({
            companies,
            success : true
        });    

    } catch (error) {
        console.log(error)
    }
}

module.exports.getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId)
        if(!company){
            return res.status(404).json({
                message : "Company not found",
                success : false
            });
        }    
        return res.status(200).json({
            company,
            success : true
        });

    } catch (error) {
        console.log(error)
    }
}

module.exports.updateCompany = async (req, res) => {
    try {
        const {name, description, website, location} = req.body;

        const file = req.file;
        let cloudResponse
        if(file){
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri?.content)
        }


        
        const updateData = {name, description, website, location} 
        if(cloudResponse){
            updateData.logo = cloudResponse.secure_url
        }

        const comapny = await Company.findByIdAndUpdate(req.params.id, updateData, {new : true})
        if(!comapny){
            return res.status(404).json({
                message : "Company not fount",
                success : false
            });
        }

        return res.status(200).json({
            message : "Company information updated",
            success : true
        });
    } catch (error) {
        console.log(error)
    }
}