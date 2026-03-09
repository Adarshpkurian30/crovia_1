import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Upload, StopCircle, Loader, FileAudio, X, Volume2, Play, Pause, RotateCcw, Copy, Check } from 'lucide-react';
import { processAudioWithGradio } from '../services/gradioService';

export default function Playground() {
  const [activeTab, setActiveTab] = useState('microphone');
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [copied, setCopied] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioPlayerRef = useRef(null);

  const waveHeights = useMemo(() => [...Array(24)].map(() => Math.random() * 60 + 10), []);

  // Audio visualization
  useEffect(() => {
    if (isRecording && analyserRef.current) {
      const updateLevel = () => {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255);
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording]);

  useEffect(() => {
    // Cleanup blob URL
    return () => {
      if (audioBlobUrl) {
        URL.revokeObjectURL(audioBlobUrl);
      }
    };
  }, [audioBlobUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup audio analyzer
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64; // Smaller FFT size for fewer bars
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);

        // Don't auto-process, let user review first
        // await processAudio(audioBlob); 

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
      setResult(null);
      setAudioBlobUrl(null);
      setAudioFile(null);
    } catch (error) {
      setError('Microphone access denied. Please enable microphone permissions.');
      console.error('Microphone error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioLevel(0);
    }
  };

  const togglePlayback = () => {
    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
      } else {
        audioPlayerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const resetRecording = () => {
    setAudioBlobUrl(null);
    setAudioFile(null);
    setResult(null);
    setError(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        setError('File too large. Maximum size is 25MB.');
        return;
      }
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioBlobUrl(url);

      setError(null);
      setResult(null);
    }
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type.includes('audio') || file.name.endsWith('.wav') || file.name.endsWith('.mp3'))) {
      if (file.size > 25 * 1024 * 1024) {
        setError('File too large. Maximum size is 25MB.');
        return;
      }
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioBlobUrl(url);

      setError(null);
      setResult(null);
    } else {
      setError('Please upload a valid audio file (.wav or .mp3)');
    }
  };

  const processAudio = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      let blobToSend;

      if (activeTab === 'microphone') {
        blobToSend = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      } else {
        blobToSend = audioFile;
      }

      if (!blobToSend) {
        setError("No audio to process");
        setIsProcessing(false);
        return;
      }

      const result = await processAudioWithGradio(blobToSend, setProcessingStatus);

      setResult({
        translation: result.text,
        advice: result.advice || null
      });
      setIsProcessing(false);
      setProcessingStatus('');

    } catch (err) {
      setIsProcessing(false);
      setProcessingStatus('');
      console.error(err);
      setError('Failed to process audio. Please try again.');
    }
  };

  const copyToClipboard = () => {
    if (result?.translation) {
      navigator.clipboard.writeText(result.translation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hidden Audio Player */}
      <audio
        ref={audioPlayerRef}
        src={audioBlobUrl}
        onEnded={handleAudioEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Interactive Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-8 relative overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Tabs */}
        <div className="relative z-10 flex gap-2 mb-10 p-1 bg-surface/50 rounded-xl border border-white/5 max-w-md mx-auto backdrop-blur-md">
          <button
            onClick={() => setActiveTab('microphone')}
            disabled={isRecording || isProcessing}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${activeTab === 'microphone'
              ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              } disabled:opacity-50`}
          >
            <div className="flex items-center justify-center gap-2">
              <Mic className="w-4 h-4" />
              Speech
            </div>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            disabled={isRecording || isProcessing}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${activeTab === 'upload'
              ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              } disabled:opacity-50`}
          >
            <div className="flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              File
            </div>
          </button>
        </div>

        {/* Microphone View */}
        {activeTab === 'microphone' && (
          <div className="flex flex-col items-center relative z-10 min-h-[300px] justify-center">

            {!audioBlobUrl ? (
              // Recording State
              <>
                <div className="relative mb-8">
                  {/* Visualizer Ring */}
                  <AnimatePresence>
                    {isRecording && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/50"
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Main Action Button */}
                  <motion.button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${isRecording
                      ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30'
                      : 'bg-gradient-to-br from-primary to-primary-hover shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <AnimatePresence mode="wait">
                      {isRecording ? (
                        <motion.div
                          key="stop"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                        >
                          <StopCircle className="w-14 h-14 text-white drop-shadow-md" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="mic"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                        >
                          <Mic className="w-14 h-14 text-white drop-shadow-md" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                <p className="text-slate-300 text-center font-display mb-2 text-lg font-medium">
                  {isRecording ? 'Listening...' : 'Tap to Speak'}
                </p>
                <p className="text-slate-500 text-center text-sm max-w-xs mx-auto">
                  {isRecording ? 'Click to stop recording' : 'Record your farming query in Malayalam'}
                </p>
              </>
            ) : (
              // Review State
              <div className="w-full max-w-md mx-auto">
                <div className="bg-surface/50 rounded-2xl p-6 border border-white/5 text-center mb-6 backdrop-blur-sm">
                  <div className="flex justify-center items-center gap-6 mb-4">
                    <button
                      onClick={resetRecording}
                      disabled={isProcessing}
                      className="p-3 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="Discard & Record Again"
                    >
                      <RotateCcw className="w-6 h-6" />
                    </button>

                    <button
                      onClick={togglePlayback}
                      className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 transition-all transform hover:scale-105"
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 fill-current" />
                      ) : (
                        <Play className="w-8 h-8 fill-current translate-x-1" />
                      )}
                    </button>
                  </div>
                  <p className="text-slate-400 text-sm">Review your recording</p>
                </div>

                <button
                  onClick={processAudio}
                  disabled={isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'Processing Audio...' : 'Translate Query'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Upload View */}
        {activeTab === 'upload' && (
          <div className="relative z-10 min-h-[300px]">
            <div
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${audioFile
                ? 'border-primary/50 bg-primary/5'
                : 'border-white/10 hover:border-primary/50 hover:bg-white/5'
                }`}
            >
              <input
                type="file"
                accept="audio/*,.wav,.mp3"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload" className="cursor-pointer block">
                {audioFile ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                      <FileAudio className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-mono text-primary truncate max-w-xs">{audioFile.name}</p>
                    <p className="text-sm text-slate-500 mt-1">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>

                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          togglePlayback();
                        }}
                        className="px-4 py-2 rounded-full bg-primary text-white text-sm font-bold flex items-center gap-2 hover:bg-primary-hover transition-colors"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? 'Pause' : 'Play Preview'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setAudioFile(null);
                          setAudioBlobUrl(null);
                        }}
                        className="px-4 py-2 rounded-full bg-slate-800 text-slate-300 text-sm font-bold hover:bg-red-500/20 hover:text-red-400 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface/50 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Upload className="w-10 h-10 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-300 mb-2 font-display">
                      Drop audio file here
                    </h3>
                    <p className="text-slate-500 text-sm">
                      or click to browse (.wav, .mp3)
                    </p>
                  </>
                )}
              </label>
            </div>

            {audioFile && !result && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={processAudio}
                disabled={isProcessing}
                className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
              >
                {isProcessing ? 'Processing Upload...' : 'Translate File'}
              </motion.button>
            )}
          </div>
        )}

        {/* Processing Status Overlay */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-surface/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8"
            >
              <div className="w-24 h-24 mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-display">Processing</h3>
              <p className="text-primary font-mono text-center max-w-xs">{processingStatus}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass rounded-3xl p-1 overflow-hidden shadow-2xl border-primary/20"
          >
            <div className="bg-gradient-to-r from-primary/10 to-transparent p-8 rounded-[22px]">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/20 rounded-xl text-primary">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Translation Complete</h3>
                  <p className="text-slate-400 text-sm">Ready for agricultural advisory systems</p>
                </div>
              </div>

              <div className="bg-surface/40 rounded-xl border border-white/10 p-6 relative group">
                <button
                  onClick={copyToClipboard}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-surface text-slate-400 hover:text-white hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                </button>

                <p className="text-lg text-slate-200 leading-relaxed font-body">
                  "{result.translation}"
                </p>
                {result.advice && (
                <div className="mt-6 bg-purple-900/40 rounded-xl border border-purple-500/30 p-6">
                  <h4 className="text-purple-300 font-semibold mb-2">
                    🤖 Crovia AI Agricultural Advice
                  </h4>
              
                  <p className="text-slate-200 leading-relaxed">
                    {result.advice}
                  </p>
                </div>
              )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={resetRecording}
                  className="text-sm text-slate-500 hover:text-primary transition-colors flex items-center gap-2 font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  Start New Query
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 p-4 bg-red-500/90 backdrop-blur-md text-white rounded-lg shadow-xl z-50 flex items-center gap-3 text-sm font-medium border border-red-400/50"
          >
            <div className="bg-white/20 p-1 rounded-full">
              <X className="w-4 h-4" />
            </div>
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
