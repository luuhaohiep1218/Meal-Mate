import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey:
    "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",
});

export const CalculateCaloriesAI = async (PROMPT) =>
  await openai.chat.completions.create({
    model: "google/gemma-3-4b-it:free",
    messages: [{ role: "user", content: PROMPT }],
  });

// console.log(completion.choices[0].message);
