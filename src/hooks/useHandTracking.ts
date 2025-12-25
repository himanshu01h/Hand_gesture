import { useEffect, useRef, useState, useCallback } from 'react';

// Define hand connections for drawing
const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],       // Index
  [0, 9], [9, 10], [10, 11], [11, 12],  // Middle
  [0, 13], [13, 14], [14, 15], [15, 16], // Ring
  [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
  [5, 9], [9, 13], [13, 17]              // Palm
];

interface HandTrackingResult {
  gesture: string | null;
  confidence: number;
}

// ASL gesture recognition based on hand landmarks
const recognizeGesture = (landmarks: any[]): HandTrackingResult => {
  if (!landmarks || landmarks.length === 0) {
    return { gesture: null, confidence: 0 };
  }

  const hand = landmarks[0];
  
  // Key landmark indices
  const WRIST = 0;
  const THUMB_TIP = 4;
  const INDEX_TIP = 8;
  const MIDDLE_TIP = 12;
  const RING_TIP = 16;
  const PINKY_TIP = 20;
  const INDEX_PIP = 6;
  const MIDDLE_PIP = 10;
  const RING_PIP = 14;
  const PINKY_PIP = 18;

  // Helper functions
  const isFingerExtended = (tipIdx: number, pipIdx: number) => {
    return hand[tipIdx].y < hand[pipIdx].y;
  };

  const isThumbExtended = () => {
    return Math.abs(hand[THUMB_TIP].x - hand[WRIST].x) > 0.1;
  };

  const fingersExtended = {
    thumb: isThumbExtended(),
    index: isFingerExtended(INDEX_TIP, INDEX_PIP),
    middle: isFingerExtended(MIDDLE_TIP, MIDDLE_PIP),
    ring: isFingerExtended(RING_TIP, RING_PIP),
    pinky: isFingerExtended(PINKY_TIP, PINKY_PIP),
  };

  const extendedCount = Object.values(fingersExtended).filter(Boolean).length;

  // ASL Letter Recognition
  
  // A - Fist with thumb alongside
  if (!fingersExtended.index && !fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky && fingersExtended.thumb) {
    return { gesture: 'A', confidence: 0.85 };
  }

  // B - Four fingers extended, thumb tucked
  if (fingersExtended.index && fingersExtended.middle && fingersExtended.ring && fingersExtended.pinky && !fingersExtended.thumb) {
    return { gesture: 'B', confidence: 0.85 };
  }

  // C - Curved hand shape
  if (extendedCount >= 3 && hand[INDEX_TIP].x < hand[PINKY_TIP].x + 0.15) {
    const distance = Math.abs(hand[THUMB_TIP].x - hand[INDEX_TIP].x);
    if (distance > 0.05 && distance < 0.15) {
      return { gesture: 'C', confidence: 0.75 };
    }
  }

  // D - Index up, other fingers touch thumb
  if (fingersExtended.index && !fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky) {
    const thumbToMiddle = Math.abs(hand[THUMB_TIP].x - hand[MIDDLE_TIP].x) + Math.abs(hand[THUMB_TIP].y - hand[MIDDLE_TIP].y);
    if (thumbToMiddle < 0.1) {
      return { gesture: 'D', confidence: 0.8 };
    }
  }

  // I - Pinky extended only
  if (!fingersExtended.index && !fingersExtended.middle && !fingersExtended.ring && fingersExtended.pinky && !fingersExtended.thumb) {
    return { gesture: 'I', confidence: 0.85 };
  }

  // J - Pinky extended with movement (simplified: pinky up, hand tilted)
  if (!fingersExtended.index && !fingersExtended.middle && !fingersExtended.ring && fingersExtended.pinky) {
    if (hand[PINKY_TIP].x < hand[WRIST].x - 0.05) {
      return { gesture: 'J', confidence: 0.75 };
    }
  }

  // L - Index and thumb extended at right angle
  if (fingersExtended.index && fingersExtended.thumb && !fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky) {
    return { gesture: 'L', confidence: 0.85 };
  }

  // O - All fingers curved to touch thumb
  if (!fingersExtended.index && !fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky) {
    const thumbToIndex = Math.abs(hand[THUMB_TIP].x - hand[INDEX_TIP].x) + Math.abs(hand[THUMB_TIP].y - hand[INDEX_TIP].y);
    if (thumbToIndex < 0.08 && !fingersExtended.thumb) {
      return { gesture: 'O', confidence: 0.8 };
    }
  }

  // U - Index and middle extended together
  if (fingersExtended.index && fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky && !fingersExtended.thumb) {
    const indexMiddleDistance = Math.abs(hand[INDEX_TIP].x - hand[MIDDLE_TIP].x);
    if (indexMiddleDistance < 0.04) {
      return { gesture: 'U', confidence: 0.8 };
    }
  }

  // V - Index and middle extended apart
  if (fingersExtended.index && fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky) {
    const indexMiddleDistance = Math.abs(hand[INDEX_TIP].x - hand[MIDDLE_TIP].x);
    if (indexMiddleDistance > 0.04) {
      return { gesture: 'V', confidence: 0.85 };
    }
  }

  // Y - Thumb and pinky extended
  if (fingersExtended.thumb && !fingersExtended.index && !fingersExtended.middle && !fingersExtended.ring && fingersExtended.pinky) {
    return { gesture: 'Y', confidence: 0.85 };
  }

  // Z - Index pointing, making Z motion (simplified: index extended, hand tilted)
  if (fingersExtended.index && !fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky && !fingersExtended.thumb) {
    if (hand[INDEX_TIP].x < hand[INDEX_PIP].x - 0.03) {
      return { gesture: 'Z', confidence: 0.75 };
    }
  }

  // Word Recognition

  // I Love You - Thumb, index, and pinky extended
  if (fingersExtended.thumb && fingersExtended.index && !fingersExtended.middle && !fingersExtended.ring && fingersExtended.pinky) {
    return { gesture: 'I Love You', confidence: 0.9 };
  }

  // Hello - Open palm, all fingers extended
  if (extendedCount === 5) {
    return { gesture: 'Hello', confidence: 0.8 };
  }

  // Yes - Fist (like nodding)
  if (extendedCount === 0) {
    return { gesture: 'Yes', confidence: 0.6 };
  }

  // No - Index and middle close together, other fingers down
  if (fingersExtended.index && fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky && !fingersExtended.thumb) {
    const distance = Math.abs(hand[INDEX_TIP].x - hand[MIDDLE_TIP].x);
    if (distance < 0.03) {
      return { gesture: 'No', confidence: 0.7 };
    }
  }

  // Please - Flat hand on chest motion (palm open, hand low)
  if (extendedCount >= 4 && hand[WRIST].y > 0.5) {
    return { gesture: 'Please', confidence: 0.6 };
  }

  // Drink - Thumb to mouth gesture (C-shape near face)
  if (fingersExtended.thumb && !fingersExtended.index && !fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky) {
    if (hand[THUMB_TIP].y < 0.4) {
      return { gesture: 'Drink', confidence: 0.7 };
    }
  }

  // Rain - Fingers down motion (all extended, pointing down)
  if (extendedCount >= 4 && hand[INDEX_TIP].y > hand[INDEX_PIP].y && hand[MIDDLE_TIP].y > hand[MIDDLE_PIP].y) {
    return { gesture: 'Rain', confidence: 0.7 };
  }

  // Eat - Fingers bunched to mouth
  if (!fingersExtended.index && !fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky) {
    if (hand[INDEX_TIP].y < 0.35 && hand[WRIST].y < 0.5) {
      return { gesture: 'Eat', confidence: 0.7 };
    }
  }

  // Thirsty - Finger down throat (index extended, pointing down near neck area)
  if (fingersExtended.index && !fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky) {
    if (hand[INDEX_TIP].y > hand[INDEX_PIP].y && hand[INDEX_TIP].y < 0.4) {
      return { gesture: 'Thirsty', confidence: 0.7 };
    }
  }

  // Say - Index near mouth
  if (fingersExtended.index && !fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky) {
    if (hand[INDEX_TIP].y < 0.3 && hand[INDEX_TIP].x > 0.4 && hand[INDEX_TIP].x < 0.6) {
      return { gesture: 'Say', confidence: 0.7 };
    }
  }

  // Maybe - Flat hands alternating (one hand up)
  if (extendedCount >= 4 && hand[WRIST].y > 0.4 && hand[WRIST].y < 0.6) {
    if (Math.abs(hand[INDEX_TIP].y - hand[PINKY_TIP].y) < 0.05) {
      return { gesture: 'Maybe', confidence: 0.65 };
    }
  }

  // Don't Know - Hand to forehead then away
  if (extendedCount >= 3 && hand[INDEX_TIP].y < 0.25) {
    return { gesture: "Don't Know", confidence: 0.65 };
  }

  // Forget - Hand from forehead outward
  if (extendedCount >= 4 && hand[WRIST].y < 0.3 && hand[INDEX_TIP].x > hand[WRIST].x + 0.1) {
    return { gesture: 'Forget', confidence: 0.65 };
  }

  // Walk - Two fingers walking motion
  if (fingersExtended.index && fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky) {
    if (hand[INDEX_TIP].y > hand[WRIST].y) {
      return { gesture: 'Walk', confidence: 0.7 };
    }
  }

  // Shirt - Pulling shirt gesture (pinching motion at chest level)
  if (fingersExtended.thumb && fingersExtended.index && !fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky) {
    const pinchDistance = Math.abs(hand[THUMB_TIP].x - hand[INDEX_TIP].x) + Math.abs(hand[THUMB_TIP].y - hand[INDEX_TIP].y);
    if (pinchDistance < 0.08 && hand[WRIST].y > 0.4) {
      return { gesture: 'Shirt', confidence: 0.7 };
    }
  }

  // Book - Palms together opening (flat hand)
  if (extendedCount >= 4 && Math.abs(hand[INDEX_TIP].y - hand[PINKY_TIP].y) < 0.03) {
    if (hand[WRIST].y > 0.45 && hand[WRIST].y < 0.55) {
      return { gesture: 'Book', confidence: 0.65 };
    }
  }

  // Look - V fingers pointing at eyes
  if (fingersExtended.index && fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky) {
    if (hand[INDEX_TIP].y < 0.3 && hand[MIDDLE_TIP].y < 0.3) {
      return { gesture: 'Look', confidence: 0.7 };
    }
  }

  // How - Hands together rotating (curved hands)
  if (extendedCount >= 3 && extendedCount <= 4) {
    const fingersCurved = hand[INDEX_TIP].y > hand[INDEX_PIP].y - 0.05;
    if (fingersCurved && hand[WRIST].y > 0.4) {
      return { gesture: 'How', confidence: 0.65 };
    }
  }

  return { gesture: null, confidence: 0 };
};

// Draw hand landmarks on canvas
const drawHandLandmarks = (
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  width: number,
  height: number
) => {
  // Draw connections
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 3;
  
  for (const [start, end] of HAND_CONNECTIONS) {
    const startPoint = landmarks[start];
    const endPoint = landmarks[end];
    
    ctx.beginPath();
    ctx.moveTo(startPoint.x * width, startPoint.y * height);
    ctx.lineTo(endPoint.x * width, endPoint.y * height);
    ctx.stroke();
  }
  
  // Draw landmarks
  ctx.fillStyle = '#16a34a';
  for (const landmark of landmarks) {
    ctx.beginPath();
    ctx.arc(landmark.x * width, landmark.y * height, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
};

// Load script dynamically
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export const useHandTracking = (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  isActive: boolean
) => {
  const [gesture, setGesture] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const lastGestureRef = useRef<string | null>(null);
  const gestureCountRef = useRef(0);
  const animationFrameRef = useRef<number>();

  const processResults = useCallback((results: any) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    ctx.clearRect(0, 0, width, height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      for (const landmarks of results.multiHandLandmarks) {
        drawHandLandmarks(ctx, landmarks, width, height);
      }

      const result = recognizeGesture(results.multiHandLandmarks);
      
      if (result.gesture === lastGestureRef.current) {
        gestureCountRef.current++;
        if (gestureCountRef.current >= 3) {
          setGesture(result.gesture);
          setConfidence(result.confidence);
        }
      } else {
        lastGestureRef.current = result.gesture;
        gestureCountRef.current = 1;
      }
    } else {
      setGesture(null);
      setConfidence(0);
      lastGestureRef.current = null;
      gestureCountRef.current = 0;
    }
  }, [canvasRef]);

  useEffect(() => {
    if (!isActive || !videoRef.current || !canvasRef.current) return;

    let isMounted = true;

    const initializeHandTracking = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load MediaPipe scripts from CDN
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');

        if (!isMounted) return;

        const win = window as any;
        
        if (!win.Hands || !win.Camera) {
          throw new Error('MediaPipe libraries failed to load');
        }

        const hands = new win.Hands({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          },
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.5,
        });

        hands.onResults(processResults);
        handsRef.current = hands;

        if (videoRef.current) {
          const camera = new win.Camera(videoRef.current, {
            onFrame: async () => {
              if (handsRef.current && videoRef.current && isMounted) {
                await handsRef.current.send({ image: videoRef.current });
              }
            },
            width: 640,
            height: 480,
          });

          cameraRef.current = camera;
          await camera.start();
          
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('Hand tracking initialization error:', err);
        if (isMounted) {
          setError('Failed to initialize hand tracking. Please refresh and try again.');
          setIsLoading(false);
        }
      }
    };

    initializeHandTracking();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, [isActive, videoRef, canvasRef, processResults]);

  return { gesture, confidence, isLoading, error };
};
