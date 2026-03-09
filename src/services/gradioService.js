
import { Client } from "@gradio/client";

/**
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
            // Assuming the first output is the translation/text
            return {
                text: result.data[0]
            };
        }

        throw new Error("No data received from model");

    } catch (error) {
        console.error("Gradio API Error:", error);
        throw error;
    }
}
