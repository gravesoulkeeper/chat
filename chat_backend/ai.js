import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.AI_API_KEY });

// export async function main() {
//   const chatCompletion = await getGroqChatCompletion();
//   // Print the completion returned by the LLM.
//   console.log(chatCompletion.choices[0]?.message?.content || "");
// }

export async function getGroqChatCompletion(msg) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: msg,
      },
    ],
    model: process.env.AI_MODEL_NAME,
  });
}
