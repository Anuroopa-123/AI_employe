import {
  generateEmployeeFeedback,
  chatService
} from "../../service/chatbot/chatbot.service.js";
import {
  processKnowledgePDF
} from "../../service/chatbot/rag.service.js";


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


export const uploadKnowledgePDF =
async (req, res) => {

  try {

    const result =
      await processKnowledgePDF(req.file);

    res.json(result);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message
    });

  }

};
