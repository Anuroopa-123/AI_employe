import axios from "axios";
import { ChromaClient } from "chromadb";

export const ollama = axios.create({
  baseURL: "http://localhost:11434",

  timeout: 120000,

  headers: {
    "Content-Type": "application/json"
  }
});


// LOCAL CHROMADB 
export const chroma = new ChromaClient({ path: "http://localhost:8000" });