import { motion } from 'framer-motion';
import { Heart, Eye, Volume2, Hand, Accessibility, Globe } from 'lucide-react';

const ProjectDescription = () => {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Silent Voices, Audible Vision</h2>
            <p className="text-sm text-muted-foreground">ASL to Speech Translation Platform</p>
          </div>
        </div>

        <p className="text-muted-foreground mb-6">
          An AI-powered platform that bridges the communication gap between the deaf community 
          and hearing individuals by translating American Sign Language (ASL) gestures into 
          spoken words in real-time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              <Eye className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">AI Vision</h4>
              <p className="text-xs text-muted-foreground">Real-time hand tracking using MediaPipe AI</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">Speech Output</h4>
              <p className="text-xs text-muted-foreground">Instant voice synthesis from gestures</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              <Hand className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">Gesture Library</h4>
              <p className="text-xs text-muted-foreground">12 letters + 20+ words supported</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              <Accessibility className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">Accessibility First</h4>
              <p className="text-xs text-muted-foreground">No special hardware required</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Why This Matters
          </h4>
          <p className="text-sm text-muted-foreground">
            Over 70 million deaf people worldwide face daily communication barriers. This platform 
            provides a free, accessible tool that works on any device with a camera—empowering 
            independence and enabling natural conversations without the need for an interpreter.
          </p>
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic text-center">
          "What a blind person needs is not a teacher but another self."
        </p>
      </motion.div>
    </div>
  );
};

export default ProjectDescription;
