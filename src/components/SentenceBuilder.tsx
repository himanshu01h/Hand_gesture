import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Volume2, Plus, Send } from 'lucide-react';

interface SentenceBuilderProps {
  detectedGestures: string[];
  onSpeak: (text: string) => void;
  onClear: () => void;
}

const QUICK_WORDS = [
  'I', 'You', 'We', 'Hello', 'Please', 'Thank You', 'Yes', 'No', 
  'Help', 'Want', 'Need', 'Good', 'Bad', 'Love', 'Sorry', 'Eat', 
  'Drink', 'Water', 'Walk', 'Look', 'How', 'What', 'Where', 'Why'
];

const SentenceBuilder = ({ detectedGestures, onSpeak, onClear }: SentenceBuilderProps) => {
  const [sentence, setSentence] = useState<string[]>([]);
  const [showQuickWords, setShowQuickWords] = useState(false);

  const addToSentence = (word: string) => {
    setSentence(prev => [...prev, word]);
  };

  const removeFromSentence = (index: number) => {
    setSentence(prev => prev.filter((_, i) => i !== index));
  };

  const clearSentence = () => {
    setSentence([]);
  };

  const speakSentence = () => {
    if (sentence.length > 0) {
      onSpeak(sentence.join(' '));
    }
  };

  const addDetectedToSentence = () => {
    if (detectedGestures.length > 0) {
      setSentence(prev => [...prev, ...detectedGestures]);
      onClear();
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">Sentence Builder</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQuickWords(!showQuickWords)}
            className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            {showQuickWords ? 'Hide Words' : 'Quick Words'}
          </button>
        </div>
      </div>

      {/* Quick Words Panel */}
      <AnimatePresence>
        {showQuickWords && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-3"
          >
            <div className="flex flex-wrap gap-1 p-2 bg-secondary/30 rounded-lg">
              {QUICK_WORDS.map((word) => (
                <button
                  key={word}
                  onClick={() => addToSentence(word)}
                  className="text-xs px-2 py-1 rounded bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {word}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add from detected gestures */}
      {detectedGestures.length > 0 && (
        <div className="mb-3 p-2 bg-primary/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {detectedGestures.map((gesture, idx) => (
                <span key={idx} className="text-sm font-medium text-primary">{gesture}</span>
              ))}
            </div>
            <button
              onClick={addDetectedToSentence}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-3 h-3" />
              Add to Sentence
            </button>
          </div>
        </div>
      )}

      {/* Sentence Display */}
      <div className="min-h-[60px] p-3 bg-output-bg rounded-lg border-2 border-dashed border-border mb-3">
        {sentence.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center">
            Build your sentence here...
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sentence.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded text-sm font-medium group"
              >
                {word}
                <button
                  onClick={() => removeFromSentence(index)}
                  className="opacity-50 hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={speakSentence}
          disabled={sentence.length === 0}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Volume2 className="w-4 h-4" />
          Speak Sentence
        </button>
        <button
          onClick={clearSentence}
          disabled={sentence.length === 0}
          className="px-4 py-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Preview */}
      {sentence.length > 0 && (
        <div className="mt-3 p-2 bg-secondary/30 rounded-lg">
          <p className="text-sm text-muted-foreground">Preview:</p>
          <p className="text-foreground font-medium">{sentence.join(' ')}</p>
        </div>
      )}
    </div>
  );
};

export default SentenceBuilder;
