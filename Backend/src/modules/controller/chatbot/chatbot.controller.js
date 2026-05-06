import {
  generateEmployeeFeedback
} from "../../service/chatbot/chatbot.service.js";

export const generateAIFeedback = async (req, res) => {

  try {

    const { employeeId } = req.params;

    const result =
      await generateEmployeeFeedback(employeeId);

    res.json(result);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};