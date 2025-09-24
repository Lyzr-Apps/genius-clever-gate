import { useState, useEffect, useRef, useCallback } from 'react';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface UseBouncinBallReturn {
  balls: Ball[];
  containerRef: React.RefObject<HTMLDivElement>;
  isRunning: boolean;
  toggleAnimation: () => void;
  resetBalls: () => void;
  addBall: () => void;
}

export const useBouncingBall = (initialBallCount: number = 1): UseBouncinBallReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [isRunning, setIsRunning] = useState(true);

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];

  const createBall = useCallback((containerWidth: number, containerHeight: number): Ball => ({
    x: Math.random() * (containerWidth - 40) + 20,
    y: Math.random() * (containerHeight - 40) + 20,
    vx: (Math.random() - 0.5) * 8,
    vy: (Math.random() - 0.5) * 8,
    radius: Math.random() * 15 + 10,
    color: colors[Math.floor(Math.random() * colors.length)]
  }), [colors]);

  const [balls, setBalls] = useState<Ball[]>([]);

  const initializeBalls = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const newBalls = Array.from({ length: initialBallCount }, () =>
      createBall(containerWidth, containerHeight)
    );

    setBalls(newBalls);
  }, [initialBallCount, createBall]);

  const updateBalls = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    setBalls(prevBalls =>
      prevBalls.map(ball => {
        let { x, y, vx, vy } = ball;

        x += vx;
        y += vy;

        if (x + ball.radius > containerWidth || x - ball.radius < 0) {
          vx = -vx * 0.98;
          x = Math.max(ball.radius, Math.min(containerWidth - ball.radius, x));
        }

        if (y + ball.radius > containerHeight || y - ball.radius < 0) {
          vy = -vy * 0.98;
          y = Math.max(ball.radius, Math.min(containerHeight - ball.radius, y));
        }

        vy += 0.3;
        vx *= 0.999;
        vy *= 0.999;

        return { ...ball, x, y, vx, vy };
      })
    );
  }, []);

  const animate = useCallback(() => {
    if (isRunning) {
      updateBalls();
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isRunning, updateBalls]);

  useEffect(() => {
    initializeBalls();

    const handleResize = () => {
      initializeBalls();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeBalls]);

  useEffect(() => {
    if (isRunning && balls.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, animate, balls.length]);

  const toggleAnimation = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const resetBalls = useCallback(() => {
    initializeBalls();
  }, [initializeBalls]);

  const addBall = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const newBall = createBall(containerWidth, containerHeight);
    setBalls(prev => [...prev, newBall]);
  }, [createBall]);

  return {
    balls,
    containerRef,
    isRunning,
    toggleAnimation,
    resetBalls,
    addBall
  };
};