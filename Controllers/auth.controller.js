import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { User } from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Access and Refresh Token Generation
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        user.save({validatebeforeSave: false});
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error generating tokens");
    }
}

// User Registration Handler
const registerUser = AsyncHandler(async(req,res)=>{
    //get user details from frontend
    //validation - non empty
    //check if user already exists: username , email
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return res
    const { fullname, email, password, company,phone, location} = req.body;
    console.log(req.body);
    if(!fullname || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }
    const existingUser = await User.findOne({ 
        email: email,
     });
    if (existingUser) {
        throw new ApiError(400, "User already exists with this  email");
    }
    const user = await User.create({
        fullname,
        email,
        password,
        company,
        phone,
        location
    });
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }
    console.log(user);
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    console.log(accessToken, refreshToken);
    const options = {
        httpOnly:true,
        secure:true
    }
    return res.status(201)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:createdUser,accessToken,refreshToken
            },
            "User Logged in Successfully"
        )
    )
    
})

// User Login Handler
const loginUser = AsyncHandler(async(req , res)=>{
        //req body -> data le aao
    // check for username or email
    // find the user
    // check password
    // access and refresh token generation and send to user
    // send cookies
    const {  email, password } = req.body;
    if (!email) {
        throw new ApiError(400, "Email is required");
    }
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(401, "User not exist");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password");
    };
    const{accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
    }
    console.log("User logged in successfully");
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User Logged in Successfully"
        )
    )
})

const logoutUser = AsyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, 
        {
            $set:{
                accessToken: null,
                refreshToken: null
            }
        },
        {
            new: true
        }
    );
    const options = {
        httponly: true, // Prevents JavaScript access to the cookie
        secure: true, // Ensures the cookie is sent over HTTPS
    }
    console.log("User logged out successfully");
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,{}, "User logged out successfully"));
})


const getProfile = AsyncHandler(async(req, res) => {
    await User.findById(req.user._id)
    .select("-password -refreshToken")
    .then(user => {
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        console.log(user);
        return res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
    })
})


const changePassword = AsyncHandler(async(req, res) => {
    const {oldPassword, newPassword, confirmPassword} = req.body;
    if (!oldPassword || !newPassword ) {
        throw new ApiError(400, "All fields are required");
    }
    // if (newPassword !== confirmPassword) {
    //     throw new ApiError(400, "New password and confirm password do not match");
    // }
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(401, "Old password is incorrect");
    }
    user.password = newPassword;
    await user.save({validateBeforeSave: false});
    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
})

const changeProfile = AsyncHandler(async(req, res) => {
    const {fullname, company, phone, location, bio} = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    user.fullname = fullname;
    user.company = company;
    user.phone = phone;
    user.location = location;
    user.bio = bio || user.bio; // Optional field, can be left empty

    await user.save({validateBeforeSave: false});
    return res.status(200).json(new ApiResponse(200, {}, "Profile updated successfully"));
})

const deleteAccount = AsyncHandler(async(req, res) => {
    const { password } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (password) {
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid password. Account deletion requires password verification");
        }
    }
    await User.findByIdAndDelete(req.user._id);
    const options = {
        httpOnly: true,
        secure: true
    }
    console.log("User account deleted successfully");
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Account deleted successfully"));
})

export {registerUser, loginUser, logoutUser, getProfile, changePassword, changeProfile, deleteAccount};