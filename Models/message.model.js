import mongoose, {Schema} from "mongoose";

const messageSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    company:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    subject:{
        type: String,
        required: true,
        enum: ['general', 'sales', 'support', 'partnership']
    },
    message:{
        type: String,
        required: true
    }
},{timestamps: true});

export const Message = mongoose.model("Message", messageSchema);