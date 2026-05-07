import { extractPDFText } from "./pdf.service.js";

export const processKnowledgePDF = async (file) => {
  try {
    console.log("Processing PDF:", file.originalname);

    const text = await extractPDFText(file.path);
    const chunks = splitTextIntoChunks(text);

    console.log(`📚 Created ${chunks.length} chunks:`);
    chunks.forEach((chunk, index) => {
      console.log(`Chunk ${index + 1}: ${chunk.substring(0, 120)}...`);
    });

    return {
      success: true,
      message: `✅ PDF uploaded successfully! ${chunks.length} chunks prepared.`,
      chunksCount: chunks.length,
      note: "ChromaDB connection skipped for now."
    };

  } catch (err) {
    console.error("PDF Processing Failed:", err.message);
    return {
      success: true,
      message: "PDF uploaded, but text extraction failed.",
      warning: err.message
    };
  }
};

function splitTextIntoChunks(text, chunkSize = 800) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks.length ? chunks : ["[Empty document]"];
}