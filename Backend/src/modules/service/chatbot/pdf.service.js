import fs from "fs";
import { createRequire } from "module";

export const extractPDFText = async (filePath) => {
  try {
    console.log(`📄 Processing: ${filePath}`);

    const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist/legacy/build/pdf.mjs");
    
    const require = createRequire(import.meta.url);
    const workerPath = require.resolve("pdfjs-dist/legacy/build/pdf.worker.mjs");
    GlobalWorkerOptions.workerSrc = `file:///${workerPath.replace(/\\/g, "/")}`;

    const data = new Uint8Array(fs.readFileSync(filePath));

    const pdf = await getDocument({
      data,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
      disableFontFace: true,
    }).promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map(item => item.str).join(" ").trim() + "\n\n";
    }

    await pdf.destroy();
    const text = fullText.trim();

    if (text.length > 80) {
      console.log(`✅ Successfully extracted ${text.length} characters`);
      return text;
    }

    throw new Error("No readable text found in this PDF.");

  } catch (err) {
    console.error("PDF Extraction Error:", err.message);
    throw new Error("Failed to extract text from PDF: " + err.message);
  }
};