import { Settings3D, draw3D } from '@/classes/3dprojection';
import { tickSquareDraw } from '@/classes/engine';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function AnimatedCanvas({ settings }: { settings: Settings3D }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frameRate, setFrameRate] = useState<number>(0);
  const animationRef = useRef<number>();

  const [mySettings] = useState(settings);

  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  // ?Resize the canvas to fill browser window dynamically
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    console.log('resizeRef');

    setCanvasSize({
      width: bounds.width * dpr,
      height: bounds.height * dpr,
    });
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [resize]);

  // ? Tick function (called every frame)
  const tick = useCallback(
    (ctx: CanvasRenderingContext2D, frames: number, timeStamp?: number) => {
      // Draw the frame
      console.log('drawTickRef');
      // tickDraw(ctx, settings);

      // tickSquareDraw(ctx, mySettings);
      draw3D(ctx, mySettings);

      // Update frame rate
      frames++;
      const lastTimeStamp = performance.now();
      if (timeStamp && lastTimeStamp > timeStamp + 1000) {
        setFrameRate(frames);
        frames = 0;
        timeStamp = lastTimeStamp;
      }

      // Handle next frame
      animationRef.current = requestAnimationFrame(
        tick.bind(null, ctx, frames, timeStamp || lastTimeStamp),
      );
    },
    [setFrameRate, mySettings],
  );

  // ? Start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('animationStartRef');
    animationRef.current = requestAnimationFrame(tick.bind(null, ctx, 0));
    return () => {
      if (animationRef.current) {
        console.log('animationCleanRef');
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [tick]);

  return (
    <div
      style={{
        // width: '90%',
        height: '60%',
        aspectRatio: '1/1',
      }}
    >
      <span>
        <b>Frame rate:</b> {frameRate}
      </span>
      <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />
    </div>
  );
}
