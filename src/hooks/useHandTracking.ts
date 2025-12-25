import { useEffect, useRef, useState, useCallback } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

// Define hand connections manually since the export is not available
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
  const THUMB_IP = 3;
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
  // A: Fist with thumb beside fingers
  if (!fingersExtended.index && !fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky && fingersExtended.thumb) {
    return { gesture: 'A', confidence: 0.85 };
  }

  // B: All fingers up, thumb across palm
  if (fingersExtended.index && fingersExtended.middle && fingersExtended.ring && fingersExtended.pinky && !fingersExtended.thumb) {
    return { gesture: 'B', confidence: 0.85 };
  }

  // C: Curved hand (approximation - fingers together and curved)
  if (extendedCount >= 3 && hand[INDEX_TIP].x < hand[PINKY_TIP].x + 0.15) {
    const distance = Math.abs(hand[THUMB_TIP].x - hand[INDEX_TIP].x);
    if (distance > 0.05 && distance < 0.15) {
      return { gesture: 'C', confidence: 0.75 };
    }
  }

  // L: Index and thumb extended, others closed
  if (fingersExtended.index && fingersExtended.thumb && !fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky) {
    return { gesture: 'L', confidence: 0.85 };
  }

  // V: Index and middle extended (peace sign)
  if (fingersExtended.index && fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky) {
    return { gesture: 'V', confidence: 0.85 };
  }

  // Words/Phrases
  // I Love You: Thumb, index, and pinky extended
  if (fingersExtended.thumb && fingersExtended.index && !fingersExtended.middle && !fingersExtended.ring && fingersExtended.pinky) {
    return { gesture: 'I Love You', confidence: 0.9 };
  }

  // Hello: Open palm, all fingers extended
  if (extendedCount === 5) {
    return { gesture: 'Hello', confidence: 0.8 };
  }

  // Yes: Fist (approximation - nodding motion would be needed for full recognition)
  if (extendedCount === 0) {
    return { gesture: 'Yes', confidence: 0.6 };
  }

  // No: Index and middle fingers together, extended
  if (fingersExtended.index && fingersExtended.middle && !fingersExtended.ring && !fingersExtended.pinky && !fingersExtended.thumb) {
    const distance = Math.abs(hand[INDEX_TIP].x - hand[MIDDLE_TIP].x);
    if (distance < 0.05) {
      return { gesture: 'No', confidence: 0.7 };
    }
  }

  // Please: Open hand on chest (approximation - hand near center)
  if (extendedCount >= 4 && hand[WRIST].y > 0.5) {
    return { gesture: 'Please', confidence: 0.6 };
  }

  return { gesture: null, confidence: 0 };
};

export const useHandTracking = (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  isActive: boolean
) => {
  const [gesture, setGesture] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const lastGestureRef = useRef<string | null>(null);
  const gestureCountRef = useRef(0);

  const onResults = useCallback((results: Results) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      for (const landmarks of results.multiHandLandmarks) {
        // Draw connections
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
          color: '#22c55e',
          lineWidth: 3,
        });
        // Draw landmarks
        drawLandmarks(ctx, landmarks, {
          color: '#16a34a',
          lineWidth: 2,
          radius: 4,
        });
      }

      const result = recognizeGesture(results.multiHandLandmarks);
      
      // Stabilize gesture detection (require same gesture 3 times)
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

    ctx.restore();
  }, [canvasRef]);

  useEffect(() => {
    if (!isActive || !videoRef.current || !canvasRef.current) return;

    const initializeHandTracking = async () => {
      setIsLoading(true);

      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(onResults);
      handsRef.current = hands;

      if (videoRef.current) {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (handsRef.current && videoRef.current) {
              await handsRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });

        cameraRef.current = camera;
        await camera.start();
        setIsLoading(false);
      }
    };

    initializeHandTracking();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, [isActive, videoRef, canvasRef, onResults]);

  return { gesture, confidence, isLoading };
};
