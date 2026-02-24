import fs from 'fs';
import { ChatModel } from '../models/chatModel.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const postChat = async (req, res) => {
  const { sessionId, message } = req.body;

  if (!sessionId || !message) {
    return res.status(400).json({ error: "sessionId and message are required" });
  }

  try {
    ChatModel.createSession(sessionId);

    const docs = JSON.parse(fs.readFileSync('./docs.json', 'utf-8'));
    const contextDocs = docs.map(d => `${d.title}: ${d.content}`).join("\n");

    const history = ChatModel.getHistory(sessionId).slice(-10);
    const historyString = history.map(h => `${h.role}: ${h.content}`).join("\n");

    const prompt = `
      System: You are a Support Assistant. 
      Answer ONLY using the provided documentation. 
      If the answer is not in the docs, say exactly: "Sorry, I don’t have information about that."
      
      Documentation:
      ${contextDocs}

      Chat History:
      ${historyString}

      User Question: ${message}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text().trim();

    ChatModel.saveMessage(sessionId, 'user', message);
    ChatModel.saveMessage(sessionId, 'assistant', reply);

    res.json({ reply, tokensUsed: result.response.usageMetadata?.totalTokenCount || 0 });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "LLM or Database failure" });
    
  }
};

export const getConversation = (req, res) => {
  const { sessionId } = req.params;
  const messages = ChatModel.getHistory(sessionId);
  res.json(messages);
};

export const listSessions = (req, res) => {
  const sessions = ChatModel.getSessions();
  res.json(sessions);
};