import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema({
    fullname:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    // username:{
    //     type:String,
    //     required:true,
    //     unique:true,
    //     lowercase:true,
    //     trim:true,
    //     index:true
    // },
    password:{
        type:String,
        required:true
    },
    company:{
        type:String,
        default:""
    },
    phone:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    }
},{timestamps:true})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password"))return next()   ;
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "1d"
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d"
        }
    )
}

export const User = mongoose.model("User", userSchema);
