import { Client } from "@gradio/client";

/* -------------------------------
   AI Agricultural Advice Function
--------------------------------*/
async function getAIAdvice(query) {
  try {

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert agricultural advisor helping farmers."
          },
          {
            role: "user",
            content: `Farmer query: ${query}. Give practical farming advice in simple language.`
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      console.error("OpenAI error:", data);
      return "AI advice could not be generated.";
    }

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
