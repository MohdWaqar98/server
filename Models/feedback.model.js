import mongoose, {Schema} from "mongoose";

const feedbackSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    mood:{
        type: String,
        enum: ['happy', 'angry', 'sad','calm','curious'],
        default: 'neutral'
    }
},{timestamps: true});

export const Feedback = mongoose.model("Feedback", feedbackSchema);