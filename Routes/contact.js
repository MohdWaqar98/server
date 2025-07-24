import { Router } from "express";

const msgRouter = Router();
import { createFeedback } from "../Controllers/feedback.controller.js";
import { createMessage } from "../Controllers/message.controller.js";

msgRouter.route("/feedback").post(createFeedback);
msgRouter.route("/message").post(createMessage);

export default msgRouter;
