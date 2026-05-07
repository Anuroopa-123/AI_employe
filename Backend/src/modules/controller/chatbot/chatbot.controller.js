import {
  generateEmployeeFeedback,
  chatService
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

export const chatWithAI = async (req, res) => {

  try {

    const result =
      await chatService(req.body);

    res.json(result);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};