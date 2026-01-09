import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, Info, BookOpen, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHandTracking } from '@/hooks/useHandTracking';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import GestureTutorials from '@/components/GestureTutorials';
import SentenceBuilder from '@/components/SentenceBuilder';
import ProjectDescription from '@/components/ProjectDescription';

const TranslatorPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showTutorials, setShowTutorials] = useState(false);
  const [showSentenceBuilder, setShowSentenceBuilder] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [translatedText, setTranslatedText] = useState<string[]>([]);
  
  const { gesture, confidence, isLoading } = useHandTracking(videoRef, canvasRef, isActive);
  const { speak, stop } = useSpeechSynthesis();

  // Handle new gesture detection
  useEffect(() => {
    if (gesture && confidence > 0.6) {
      setTranslatedText((prev) => {
        const lastItem = prev[prev.length - 1];
        if (lastItem !== gesture) {
          return [...prev.slice(-9), gesture]; // Keep last 10 items
        }
        return prev;
      });

      if (!isMuted) {
        speak(gesture);
      }
    }
  }, [gesture, confidence, isMuted, speak]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      stop();
    }
  };

  const clearText = () => {
    setTranslatedText([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background p-4 md:p-6"
    >
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Go back to home"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="font-medium">Back</span>
        </button>

        <h1 className="text-xl md:text-2xl font-bold text-foreground">
          ASL Translator
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            aria-label="About project"
          >
            <Info className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowTutorials(!showTutorials)}
            className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            aria-label="Show tutorials"
          >
            <BookOpen className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSentenceBuilder(!showSentenceBuilder)}
            className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            aria-label="Sentence builder"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* About Panel */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <ProjectDescription />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorials Panel */}
      <AnimatePresence>
        {showTutorials && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <GestureTutorials onSelectGesture={(g) => speak(g)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sentence Builder Panel */}
      <AnimatePresence>
        {showSentenceBuilder && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <SentenceBuilder 
              detectedGestures={translatedText} 
              onSpeak={(text) => speak(text)} 
              onClear={clearText} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Camera Feed */}
        <div className="relative">
          <div className="relative aspect-[4/3] bg-card rounded-xl overflow-hidden camera-glow">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-card z-20">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading AI Vision...</p>
                </div>
              </div>
            )}
            
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
              playsInline
              autoPlay
              muted
            />
            
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
            />

            {/* Current Gesture Badge */}
            <AnimatePresence>
              {gesture && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute bottom-4 left-4 right-4"
                >
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-center font-bold text-lg">
                    Detected: {gesture}
                    <span className="ml-2 text-sm opacity-80">
                      ({Math.round(confidence * 100)}%)
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-3">
            Position your hand clearly in the camera frame
          </p>
        </div>

        {/* Output Display */}
        <div className="flex flex-col">
          <div className="flex-1 bg-output-bg border-4 border-border rounded-xl p-6 min-h-[300px] lg:min-h-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Translation Output</h2>
              {translatedText.length > 0 && (
                <button
                  onClick={clearText}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-2">
              {translatedText.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Start signing to see translations here...
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {translatedText.map((text, index) => (
                    <motion.span
                      key={`${text}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
                    >
                      {text}
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Latest Detection */}
          <div className="mt-4 bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <div>
                <p className="text-sm text-muted-foreground">Currently Detecting</p>
                <p className="text-2xl font-bold text-foreground">
                  {gesture || 'No gesture detected'}
                </p>
              </div>
              {!isMuted && gesture && (
                <Volume2 className="w-6 h-6 text-primary ml-auto animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TranslatorPage;
