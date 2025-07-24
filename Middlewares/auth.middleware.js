import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import {AsyncHandler} from "../Utils/AsyncHandler.js";

import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";

export const verifyJWT = AsyncHandler(async(req, res, next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            throw new ApiError(401, "Unautorized Access");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError(401, "User not found");
        }
        req.user = user; // Attach the user to the request object
        next(); // Call the next middleware or route handler
    } catch (error) {
        throw new ApiError(401,"Invalid Access Token");
    }
})