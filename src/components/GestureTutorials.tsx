import { motion } from 'framer-motion';
import { Hand, BookOpen } from 'lucide-react';

interface Tutorial {
  gesture: string;
  type: 'letter' | 'word';
  description: string;
  steps: string[];
}

const TUTORIALS: Tutorial[] = [
  // Letters
  { gesture: 'A', type: 'letter', description: 'Fist with thumb alongside', steps: ['Make a fist', 'Rest thumb on side of fist'] },
  { gesture: 'B', type: 'letter', description: 'Four fingers up, thumb tucked', steps: ['Extend all four fingers upward', 'Tuck thumb across palm'] },
  { gesture: 'C', type: 'letter', description: 'Curved hand shape', steps: ['Curve all fingers', 'Form a C shape with hand'] },
  { gesture: 'D', type: 'letter', description: 'Index up, others touch thumb', steps: ['Extend index finger up', 'Touch other fingers to thumb tip'] },
  { gesture: 'I', type: 'letter', description: 'Pinky extended only', steps: ['Make a fist', 'Extend only pinky finger'] },
  { gesture: 'J', type: 'letter', description: 'Pinky extended, J motion', steps: ['Extend pinky finger', 'Draw J shape in air'] },
  { gesture: 'L', type: 'letter', description: 'L shape with thumb and index', steps: ['Extend thumb and index finger', 'Form 90-degree L shape'] },
  { gesture: 'O', type: 'letter', description: 'All fingers curved to thumb', steps: ['Curve all fingers', 'Touch fingertips to thumb'] },
  { gesture: 'U', type: 'letter', description: 'Index and middle together', steps: ['Extend index and middle fingers', 'Keep them together touching'] },
  { gesture: 'V', type: 'letter', description: 'Peace sign', steps: ['Extend index and middle fingers', 'Spread them apart in V shape'] },
  { gesture: 'Y', type: 'letter', description: 'Thumb and pinky extended', steps: ['Make loose fist', 'Extend thumb and pinky only'] },
  { gesture: 'Z', type: 'letter', description: 'Index drawing Z', steps: ['Extend index finger', 'Draw Z shape in air'] },
  // Words
  { gesture: 'Hello', type: 'word', description: 'Open palm wave', steps: ['Open palm with all fingers spread', 'Wave gently'] },
  { gesture: 'I Love You', type: 'word', description: 'Thumb, index, pinky extended', steps: ['Extend thumb, index, and pinky', 'Keep middle and ring folded'] },
  { gesture: 'Yes', type: 'word', description: 'Fist nodding motion', steps: ['Make a fist', 'Nod hand like nodding head'] },
  { gesture: 'No', type: 'word', description: 'Index and middle close', steps: ['Extend index and middle fingers', 'Tap them together'] },
  { gesture: 'Please', type: 'word', description: 'Flat hand on chest', steps: ['Flat open palm', 'Circle on chest'] },
  { gesture: 'Thank You', type: 'word', description: 'Hand from chin forward', steps: ['Touch fingertips to chin', 'Move hand forward'] },
  { gesture: 'Drink', type: 'word', description: 'C-shape to mouth', steps: ['Make C shape', 'Bring to mouth like drinking'] },
  { gesture: 'Eat', type: 'word', description: 'Bunched fingers to mouth', steps: ['Bunch fingertips together', 'Tap to mouth repeatedly'] },
  { gesture: 'Water', type: 'word', description: 'W at chin', steps: ['Make W with 3 fingers', 'Tap chin twice'] },
  { gesture: 'Help', type: 'word', description: 'Thumbs up on palm', steps: ['Make thumbs up', 'Place on flat palm, lift up'] },
  { gesture: 'Sorry', type: 'word', description: 'Fist circle on chest', steps: ['Make a fist', 'Circle on chest'] },
  { gesture: 'Good', type: 'word', description: 'Hand from chin down', steps: ['Flat hand at chin', 'Move down to other palm'] },
  { gesture: 'Bad', type: 'word', description: 'Hand from chin flip', steps: ['Touch chin with fingers', 'Flip hand down'] },
  { gesture: 'Walk', type: 'word', description: 'Two fingers walking', steps: ['Extend index and middle', 'Walk fingers forward'] },
  { gesture: 'Look', type: 'word', description: 'V fingers from eyes', steps: ['Make V shape', 'Point from eyes outward'] },
  { gesture: 'How', type: 'word', description: 'Curved hands rotating', steps: ['Curve both hands', 'Rotate them together'] },
];

interface GestureTutorialsProps {
  onSelectGesture?: (gesture: string) => void;
}

const GestureTutorials = ({ onSelectGesture }: GestureTutorialsProps) => {
  const letters = TUTORIALS.filter(t => t.type === 'letter');
  const words = TUTORIALS.filter(t => t.type === 'word');

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Gesture Tutorials</h3>
      </div>

      <div className="space-y-4">
        {/* Letters Section */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Letters</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {letters.map((tutorial) => (
              <motion.button
                key={tutorial.gesture}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectGesture?.(tutorial.gesture)}
                className="bg-secondary/50 hover:bg-secondary rounded-lg p-2 text-center group relative"
              >
                <div className="flex items-center justify-center w-8 h-8 mx-auto bg-primary/20 rounded-full mb-1">
                  <Hand className="w-4 h-4 text-primary" />
                </div>
                <span className="font-bold text-primary text-sm">{tutorial.gesture}</span>
                <p className="text-[10px] text-muted-foreground line-clamp-1">{tutorial.description}</p>
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-popover border border-border rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  <p className="text-xs font-medium text-foreground mb-1">{tutorial.gesture}</p>
                  <ul className="text-[10px] text-muted-foreground space-y-0.5">
                    {tutorial.steps.map((step, idx) => (
                      <li key={idx}>{idx + 1}. {step}</li>
                    ))}
                  </ul>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Words Section */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Words & Phrases</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {words.map((tutorial) => (
              <motion.button
                key={tutorial.gesture}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectGesture?.(tutorial.gesture)}
                className="bg-secondary/50 hover:bg-secondary rounded-lg p-2 text-left group relative"
              >
                <span className="font-semibold text-primary text-xs">{tutorial.gesture}</span>
                <p className="text-[10px] text-muted-foreground line-clamp-1">{tutorial.description}</p>
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-popover border border-border rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  <p className="text-xs font-medium text-foreground mb-1">{tutorial.gesture}</p>
                  <ul className="text-[10px] text-muted-foreground space-y-0.5">
                    {tutorial.steps.map((step, idx) => (
                      <li key={idx}>{idx + 1}. {step}</li>
                    ))}
                  </ul>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestureTutorials;
