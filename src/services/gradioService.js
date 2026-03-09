
async function getAIAdvice(query) {
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
          content: `Farmer query: ${query}. Give practical farming advice.`
        }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
 * Connects to the agri-whisper-api Gradio space and processes the audio.
 * @param {Blob} audioBlob - The audio file to process
 * @param {function} onStatusChange - Callback for status updates
 * @returns {Promise<{text: string}>} - The translation result
 */
export async function processAudioWithGradio(audioBlob, onStatusChange) {
    try {
        onStatusChange?.("Connecting to Agri-Whisper Model...");

        // Connect to the specific space
        const client = await Client.connect("Cro-via/agri-whisper-api");

        onStatusChange?.("Processing audio (this typically takes 30-60s)...");

        // The error message explicitly stated "No value provided for required parameter: audio_path"
        const result = await client.predict("/predict", {
            audio_path: audioBlob
        });

        // The result from client.predict matches the return values of the Gradio function.
        // It is typically an object with 'data' array.

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
