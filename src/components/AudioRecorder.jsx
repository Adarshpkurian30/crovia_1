import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Square, Loader2, Upload, Languages, Bot, CheckCircle2, AlertCircle } from 'lucide-react';
import { processAudio } from '../services/api';

const STATUS_CONFIG = {
  idle: {
    text: 'Tap to speak',
    subtext: 'Hold the button and ask your question',
    icon: Mic,
    color: 'bg-crovia-green-800 hover:bg-crovia-green-700',
  },
  recording: {
    text: 'Listening...',
    subtext: 'Speak clearly, tap again when done',
    icon: Square,
    color: 'bg-red-600 hover:bg-red-700 animate-pulse-recording',
  },
  uploading: {
    text: 'Uploading...',
    subtext: 'Sending your question to our experts',
    icon: Upload,
    color: 'bg-crovia-brown-600',
  },
  translating: {
    text: 'Translating...',
    subtext: 'Converting your speech to text',
    icon: Languages,
    color: 'bg-crovia-brown-600',
  },
  consulting: {
    text: 'Consulting AI Expert...',
    subtext: 'Getting the best advice for you',
    icon: Bot,
    color: 'bg-crovia-green-700',
  },
  done: {
    text: 'Done!',
    subtext: 'Your answer is ready below',
    icon: CheckCircle2,
    color: 'bg-crovia-green-800',
  },
  error: {
    text: 'Error occurred',
    subtext: 'Please try again',
    icon: AlertCircle,
    color: 'bg-red-600',
  },
};

export default function AudioRecorder({ onResult, onError }) {
  const [status, setStatus] = useState('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  const isProcessing = ['uploading', 'translating', 'consulting'].includes(status);
  const isRecording = status === 'recording';

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = useCallback(async () => {
    try {
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4',
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType
        });

        // Stop all tracks
        streamRef.current?.getTracks().forEach(track => track.stop());

        // Process the audio
        await handleProcessAudio(audioBlob);
      };

      mediaRecorder.start(1000); // Collect data every second
      setStatus('recording');
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      onError?.('Could not access microphone. Please allow microphone permission.');
      setStatus('error');
    }
  }, [onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
    }
  }, []);

  const handleProcessAudio = async (audioBlob) => {
    try {
      const result = await processAudio(audioBlob, setStatus);
      onResult?.(result);

      // Reset to idle after a short delay
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      onError?.(error.message);
      setStatus('error');

      // Reset to idle after showing error
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleButtonClick = () => {
    if (isProcessing) return;

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const currentStatus = STATUS_CONFIG[status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Status Text */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-crovia-green-900 mb-2">
          {currentStatus.text}
        </h2>
        <p className="text-lg text-crovia-brown-600">
          {currentStatus.subtext}
        </p>
      </div>

      {/* Recording Timer */}
      {isRecording && (
        <div className="text-4xl font-mono font-bold text-red-600">
          {formatTime(recordingTime)}
        </div>
      )}

      {/* Processing Spinner */}
      {isProcessing && (
        <div className="flex items-center gap-3 text-crovia-brown-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-lg">Please wait...</span>
        </div>
      )}

      {/* Main Record Button */}
      <button
        onClick={handleButtonClick}
        disabled={isProcessing}
        className={`
          relative w-32 h-32 md:w-40 md:h-40 rounded-full 
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          shadow-lg hover:shadow-xl
          disabled:cursor-not-allowed disabled:opacity-70
          focus:outline-none focus:ring-4 focus:ring-crovia-green-300
          ${currentStatus.color}
        `}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isProcessing ? (
          <Loader2 className="w-16 h-16 md:w-20 md:h-20 text-white animate-spin" />
        ) : (
          <StatusIcon className="w-16 h-16 md:w-20 md:h-20 text-white" />
        )}

        {/* Pulse rings for recording */}
        {isRecording && (
          <>
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" />
            <span className="absolute inset-0 rounded-full bg-red-500 animate-pulse opacity-20" />
          </>
        )}
      </button>

      {/* Helper Text */}
      <div className="text-center mt-4">
        {status === 'idle' && (
          <p className="text-crovia-brown-500 text-sm md:text-base">
            🌾 Ask about crops, weather, pests, or farming advice
          </p>
        )}
        {isRecording && (
          <p className="text-red-600 text-sm md:text-base font-medium">
            🔴 Recording in progress...
          </p>
        )}
        {isProcessing && (
          <div className="flex flex-col gap-2">
            <p className="text-crovia-brown-600 text-sm md:text-base">
              ⏳ This may take a moment for longer questions
            </p>
            <div className="flex justify-center gap-1">
              <span className="w-2 h-2 bg-crovia-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-crovia-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-crovia-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

