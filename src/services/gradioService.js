import { Client } from "@gradio/client";

/* -------------------------------
   Demo Request Limit
--------------------------------*/
let demoCount = 0;
const DEMO_LIMIT = 25;

/* -------------------------------
   AI Agricultural Advice Function
--------------------------------*/
async function getAIAdvice(query) {

  if (demoCount >= DEMO_LIMIT) {
    return "Demo limit reached. Please contact the developer for full access.";
  }

  demoCount++;

  try {

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_GROQ_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
           content: `Farmer query: ${query}. Give practical farming advice. 
          First give the answer in English, then give the same advice translated into Malayalam.`
          },
          {
            role: "user",
            content: `Farmer query: ${query}. Give practical farming advice in simple language.`
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", JSON.stringify(data, null, 2));
      return "AI advice could not be generated.";
    }
    console.log("Groq response:", data);
    return data.choices[0].message.content;

  } catch (error) {
    console.error("AI Advice Error:", error);
    return "Unable to generate agricultural advice.";
  }
}


/* -----------------------------------------
   Process Audio using Crovia Whisper Model
------------------------------------------*/
export async function processAudioWithGradio(audioBlob, onStatusChange) {

  try {

    onStatusChange?.("Connecting to Agri-Whisper Model...");

    const client = await Client.connect("Cro-via/agri-whisper-api");

    onStatusChange?.("Processing audio (this typically takes 30-60s)...");

    const result = await client.predict("/predict", {
      audio_path: audioBlob
    });

    if (result.data && result.data.length > 0) {

      const translation = result.data[0];

      onStatusChange?.("Consulting Agricultural AI...");

      const advice = await getAIAdvice(translation);

      return {
        text: translation,
        advice: advice
      };

    }

    throw new Error("No data received from model");

  } catch (error) {
    console.error("Gradio API Error:", error);
    throw error;
  }

}
