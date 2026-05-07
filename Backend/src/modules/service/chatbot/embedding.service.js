import { ollama }
from "../../../config/ai.config.js";

export const generateEmbedding =
async (text) => {

  try {

    const response =
      await ollama.post(

        "/api/embed",

        {
          model: "nomic-embed-text",
          input: text
        }

      );

    return response
      .data
      .embeddings[0];

  } catch (err) {

    console.log(
      "Embedding Error:",
      err.response?.data ||
      err.message
    );

    return [];

  }

};

