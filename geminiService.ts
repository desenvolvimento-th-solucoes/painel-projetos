
import { GoogleGenAI } from "@google/genai";
import { Project } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAiInsights = async (projects: Project[], userName: string) => {
  const prompt = `
    Como um assistente analista de performance, analise os seguintes dados do usuário ${userName}:
    
    Projetos: ${JSON.stringify(projects)}
    
    Forneça um resumo motivacional e estratégico de 3 parágrafos curtos:
    1. Status geral do portfólio de projetos.
    2. Alerta de gargalo ou atraso (O que precisa de atenção imediata).
    3. Sugestão de próxima ação para otimizar os resultados.
    
    Responda em Português do Brasil. Use tom profissional e encorajador.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao obter insights da IA:", error);
    return "Desculpe, não consegui analisar seus dados no momento. Tente novamente em breve.";
  }
};
