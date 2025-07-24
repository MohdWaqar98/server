import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { Feedback } from "../Models/feedback.model.js";

const createFeedback = AsyncHandler(async (req, res) => {
    const { name, email, message, mood } = req.body;
    console.log(req.body)
    if (!name || !email || !message) {
        throw new ApiError(400, "All fields are required");
    }

    const feedback = await Feedback.create({
        name,
        email,
        message,
        mood : mood.toLowerCase()
    });

    if (!feedback) {
        throw new ApiError(500, "Something went wrong while submitting feedback");
    }

    return res.status(201).json(new ApiResponse("Feedback submitted successfully", feedback));
})

export {createFeedback};