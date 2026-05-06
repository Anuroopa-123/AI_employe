import axios from "axios";

export const ollama = axios.create({
  baseURL: "http://localhost:11434",

  timeout: 120000,

  headers: {
    "Content-Type": "application/json"
  }
});