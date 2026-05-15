import { chroma } from "../../../config/ai.config.js";

import { generateEmbedding }
from "./embedding.service.js";

import { extractPDFText }
from "./pdf.service.js";

export const processKnowledgePDF =
async (file) => {

  try {

    console.log(
      "Processing PDF:",
      file.originalname
    );

    // =========================
    // EXTRACT PDF TEXT
    // =========================

    const text =
      await extractPDFText(file.path);

    // =========================
    // SPLIT INTO CHUNKS
    // =========================

    const chunks =
      splitTextIntoChunks(text);

    console.log(
      `📚 Created ${chunks.length} chunks`
    );

    // =========================
    // CHROMADB COLLECTION
    // =========================

    const collection =
      await chroma.getOrCreateCollection({

        name: "company_knowledge"

      });

    // =========================
    // LOOP CHUNKS
    // =========================

    for (
      let i = 0;
      i < chunks.length;
      i++
    ) {

      const chunk =
        chunks[i];

      console.log(
        `Processing chunk ${i + 1}`
      );

      // =====================
      // GENERATE EMBEDDING
      // =====================

      const embedding =
        await generateEmbedding(chunk);

      // =====================
      // SAVE TO CHROMADB
      // =====================

      await collection.add({

        ids: [
          `${file.filename}_${i}`
        ],

        documents: [
          chunk
        ],

        embeddings: [
          embedding
        ],

        metadatas: [
          {
            source:
              file.originalname
          }
        ]

      });

    }

    // =========================
    // SUCCESS RESPONSE
    // =========================

    return {

      success: true,

      message:
        `✅ PDF uploaded successfully! ${chunks.length} chunks stored in ChromaDB.`,

      chunksCount:
        chunks.length

    };

  } catch (err) {

    console.error(
      "PDF Processing Failed:",
      err.message
    );

    return {

      success: false,

      message:
        "PDF processing failed.",

      warning:
        err.message

    };

  }

};

// =============================
// SPLIT FUNCTION
// =============================

function splitTextIntoChunks(
  text,
  chunkSize = 800
) {

  const chunks = [];

  for (
    let i = 0;
    i < text.length;
    i += chunkSize
  ) {

    chunks.push(
      text.slice(i, i + chunkSize)
    );

  }

  return chunks.length
    ? chunks
    : ["[Empty document]"];

}