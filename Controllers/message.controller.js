import { ApiError } from "../Utils/ApiError.js";
import { Message } from "../Models/message.model.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";


const createMessage = AsyncHandler(async (req, res) => {
    const { name, email, company, phone, subject, message } = req.body;
    console.log(req.body);
    if (!name || !email || !company || !phone || !subject || !message) {
        throw new ApiError(400, "All fields are required");
    }

    const msg = await Message.create({
        name,
        email,
        company,
        phone,
        subject,
        message
    });

    return res.status(201).json(
        new ApiResponse("Message sent successfully", msg)
    );
}   );  

export { createMessage };