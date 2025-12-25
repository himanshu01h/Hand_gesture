import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Volume2, Eye, Hand } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory hide-scrollbar">
      {/* Section 1: Hero with Video Background */}
      <section className="h-screen snap-start relative flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-background/70" />
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-text-hero tracking-tight mb-6">
            Silent Voices, Audible Vision
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-text-muted-italic italic max-w-2xl mx-auto">
            "What a blind person needs is not a teacher but another self."
          </p>
          
          <motion.button
            onClick={() => scrollToSection(section2Ref)}
            className="mt-12 text-muted-foreground hover:text-foreground transition-colors"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            aria-label="Scroll down"
          >
            <ChevronDown className="w-10 h-10" />
          </motion.button>
        </motion.div>
      </section>

      {/* Section 2: Features */}
      <section
        ref={section2Ref}
        className="h-screen snap-start relative flex items-center justify-center bg-background"
      >
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-12">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-xl border border-border"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Hand className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Sign Language</h3>
                <p className="text-muted-foreground">
                  Express yourself through ASL hand gestures captured by your camera
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-xl border border-border"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">AI Vision</h3>
                <p className="text-muted-foreground">
                  Real-time hand tracking and gesture recognition powered by AI
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-xl border border-border"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Volume2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Voice Output</h3>
                <p className="text-muted-foreground">
                  Instant speech synthesis converts your signs into natural voice
                </p>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.button
            onClick={() => scrollToSection(section3Ref)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            aria-label="Scroll down"
          >
            <ChevronDown className="w-10 h-10" />
          </motion.button>
        </div>
      </section>

      {/* Section 3: CTA */}
      <section
        ref={section3Ref}
        className="h-screen snap-start relative flex items-center justify-center bg-background"
      >
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 text-center px-6"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Bridge the Gap?
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
            Start translating ASL gestures to speech in real-time
          </p>
          
          <motion.button
            onClick={() => navigate('/translator')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-12 py-5 text-xl font-bold text-primary-foreground bg-primary rounded-full glow-button animate-glow-pulse"
            aria-label="Launch Translator"
          >
            Launch Translator
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
