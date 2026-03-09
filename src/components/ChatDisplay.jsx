import { User, Bot, Sparkles, Volume2 } from 'lucide-react';
import { useState } from 'react';

function MessageCard({ type, content, icon: Icon, title }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakText = () => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(content);
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const isUser = type === 'user';

  return (
    <div
      className={`
        rounded-2xl p-5 md:p-6 shadow-md
        ${isUser 
          ? 'bg-crovia-cream-100 border-2 border-crovia-brown-200' 
          : 'bg-white border-2 border-crovia-green-200'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`
              w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
              ${isUser ? 'bg-crovia-brown-500' : 'bg-crovia-green-700'}
            `}
          >
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h3 className={`
              font-bold text-lg md:text-xl
              ${isUser ? 'text-crovia-brown-800' : 'text-crovia-green-800'}
            `}>
              {title}
            </h3>
            {!isUser && (
              <span className="text-xs text-crovia-green-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI-Powered Response
              </span>
            )}
          </div>
        </div>

        {/* Text-to-Speech Button */}
        <button
          onClick={isSpeaking ? stopSpeaking : speakText}
          className={`
            p-2 md:p-3 rounded-full transition-all
            ${isSpeaking 
              ? 'bg-crovia-green-600 text-white' 
              : 'bg-crovia-cream-200 text-crovia-brown-600 hover:bg-crovia-cream-300'
            }
          `}
          title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
        >
          <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-pulse' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div
        className={`
          text-lg md:text-xl leading-relaxed
          ${isUser ? 'text-crovia-brown-700' : 'text-crovia-green-900'}
        `}
      >
        {content}
      </div>
    </div>
  );
}

export default function ChatDisplay({ result, error }) {
  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😔</span>
          </div>
          <h3 className="text-xl font-bold text-red-700 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-red-600 text-lg">
            {error}
          </p>
          <p className="text-red-500 text-sm mt-4">
            Please try recording your question again
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="bg-crovia-cream-50 border-2 border-dashed border-crovia-brown-200 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-crovia-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🌱</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-crovia-green-800 mb-2">
            Welcome to CROVIA
          </h3>
          <p className="text-crovia-brown-600 text-lg">
            Your AI-powered agricultural advisor
          </p>
          <div className="mt-6 space-y-2 text-left max-w-md mx-auto">
            <p className="text-crovia-brown-500 text-sm md:text-base flex items-start gap-2">
              <span>🎤</span>
              <span>Tap the microphone button above</span>
            </p>
            <p className="text-crovia-brown-500 text-sm md:text-base flex items-start gap-2">
              <span>🗣️</span>
              <span>Speak your question in your language</span>
            </p>
            <p className="text-crovia-brown-500 text-sm md:text-base flex items-start gap-2">
              <span>✨</span>
              <span>Get expert farming advice instantly</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      {/* User's Query */}
      <MessageCard
        type="user"
        content={result.translatedQuery}
        icon={User}
        title="Your Question"
      />

      {/* AI Response */}
      <MessageCard
        type="bot"
        content={result.advice}
        icon={Bot}
        title="Expert Advice"
      />

      {/* Action hint */}
      <div className="text-center pt-4">
        <p className="text-crovia-brown-500 text-sm">
          🎤 Tap the microphone to ask another question
        </p>
      </div>
    </div>
  );
}

