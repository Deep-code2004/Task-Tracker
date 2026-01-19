
import { GoogleGenAI, Type } from "@google/genai";
import { Task, Priority, Status } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async analyzeTasks(tasks: Task[]) {
    const prompt = `Analyze the following tasks and provide a 2-sentence summary of productivity and 3 actionable suggestions for optimization. 
    Tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, priority: t.priority, status: t.status })))}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text;
  },

  async suggestSubtasks(taskTitle: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Given the task title "${taskTitle}", suggest 3-4 concrete subtasks or steps to complete it. Return as a bulleted list.`,
    });

    return response.text;
  }
};
