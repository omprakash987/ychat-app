import bcrypt from 'bcryptjs'
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js'

export const signUp = async(req,res)=>{
    const {fullName ,email,password } = req.body; 

    try {
        if(password.length < 6){
            return res.status(400).json({
                message:"password should be at least 6 char"
            })
        }
        const user = await User.findOne({email});
        if(user){
            res.status(400).json({
                message:"email already exist",
            })
        }
        const hashPassword = await bcrypt.hash(password,10); 

        const newuser = await User.create({
            email,fullName,password:hashPassword
        })
       if(newuser){
        await generateToken(newuser._id,res); 
        await newuser.save(); 
      return res.status(200).json({
            message:"signup successfull"
        })
       }else{
        console.log("invalid user data"); 
        res.status(400).json({
            message:"Invalid user data"
        }); 
       }
    } catch (error) {
        console.log("error from signup: ", error); 
        res.status(500).json({
            message:"internal server error from signup"
        })
    }
}
export const Login = async(req,res)=>{
    const {email,password} = req.body; 

try {
    if(!email && !password){
        return res.status(400).json({
            message:"email and password are required"
        })
    }; 

    const user  = await User.findOne({email}); 
    if(!user){
        return res.status(400).json({
            message:"no user exist"
        })
    }
  const isPassword =   await bcrypt.compare(password,user.password); 
  if(!isPassword){
    return res.status(400).json({
        message:"invalid credentials"
    })
  }
  generateToken(user._id,res); 
  res.status(200).json({
    _id:user._id,
    fullName:user.fullName,
    email:user.email,
    profilePic:user.profilePic,
    message:"login successfull"
  })
    
} catch (error) {
    console.log("error from login : ", error); 
    res.status(500).json({
        message:"internal server error from login"
    })
}
}; 
export const Logout = async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:"0"}); 
        res.status(200).json({message:"logged out successfull"});
    } catch (error) {
        console.log("error in logout contnroller", error.message); 
        res.status(500).json({
            message:"internal server error "
        })
    }
};

export const updateProfile = async(req,res)=>{
    try {
        const { profilePic} = req.body; 
      const userId =   req.user._id; 
      if(!profilePic){
        return res.status(400).json({
            message:'profile pic is required',
        })
      }
    const uploadResponse = await cloudinary.uploader.upload(profilePic); 
    const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true}); 

    res.status(200).json({
        message:"profile updated successfull",
        updatedUser
    }); 
        
    } catch (error) {
        console.log("error from udpate profile : ", error); 
        res.status(500).json({
            message:"internal server error from update profile section"
        })
    }
}

export const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user); 
    } catch (error) {
        console.log("error : ", error); 

        res.status(500).json({
            message:"error from check auth ",
        })
    }
}