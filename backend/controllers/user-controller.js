const User = require("../models/user-model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const getDataUri = require("../utils/dataUri");
const cloudinary = require("../utils/cloudinary");


module.exports.register = async(req, res) => {
    try {
        const {fullname, email, phoneNumber, password, role} = req.body;
        if(!fullname || !phoneNumber || !email || !password || !role){
            return res.status(400).json({
                message : "All fields are required",
                success : false
            });
        };

        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content)
      

        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({
                message : "User already exist",
                success : false
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password : hashedPassword,
            role,
            profile : {
                profilePhoto : cloudResponse.secure_url,
            }
        })

        return res.status(201).json({
            message : "Account created successfully",
            success : true,
        })

    } catch (error) {
        console.log(error)
    }
}

module.exports.login = async(req, res) => {
    try {
        const {email, password, role} = req.body;
        if(!email || !password || !role){
            return res.status(400).json({
                message : "All fields are required",
                success : false
            });
        };

        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message : "Incorrect email or password",
                success : false
            });
        }
        const isPassword = await bcrypt.compare(password, user.password);
        if(!isPassword){
            return res.status(400).json({
                message : "Incorrect email or password",
                success : false
            });
        }

        //check role
        if(role !== user.role){
            return res.status(400).json({
                message : "Account doesn't exist with current role",
                success : false
            });
        }
        
        //token generate
        const tokenData = {
            userid : user._id
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn : "1d"});

        user = {
            _id : user._id,
            fullname : user.fullname,
            email : user.email,
            phoneNumber : user.phoneNumber,
            role : user.role,
            profile : user.profile
        }

        return res.status(200).cookie(
            "token", token, 
            {
                maxAge : 1*24*60*60*1000,
                httpOnly : true,
                sameSite : "strict"
            }
        ).json({
            message : `Welcome back ${user.fullname}`,
            user,
            success : true
        })


    } catch (error) {
        console.log(error)
    }
}

module.exports.logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge : 0}).json({
            message : "Logged out successfully",
            success : true
        })
    } catch (error) {
        console.log(error)
    }
}  

module.exports.updateProfile = async (req, res) => {
    try {
        const {fullname, email, phoneNumber, bio, skills} = req.body;

        const skillsArray = skills?.split(",");
        const userId = req.id;
        let user = await User.findById(userId);

        if(!user){
            return res.status(400).cookie("token", "", {maxAge : 0}).json({
                message : "User not found",
                success : false
            })
        }

        const file = req.file;
        let cloudResponse
        if(file){
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri?.content)
        }

        if(fullname) user.fullname = fullname;
        if(email) user.email = email;
        if(phoneNumber) user.phoneNumber = phoneNumber;
        if(bio) user.profile.bio = bio;
        if(skills) user.profile.skills = skillsArray;

        //resume
        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url
            user.profile.resumeOriginalName = file.originalname
        }

        await user.save();

        user = {
            _id : user._id,
            fullname : user.fullname,
            email : user.email,
            phoneNumber : user.phoneNumber,
            role : user.role,
            profile : user.profile
        }

        return res.status(200).json({
            message : "Profile updated successfully",
            user,
            success : true
        })



    } catch (error) {
        console.log(error)
    }
}