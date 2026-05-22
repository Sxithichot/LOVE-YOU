import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  alpha: number;
  targetAlpha: number;
  delay: number;
  scale: number;
  angle: number;
  text: string;
  color: string;
  shadowColor: string;
}

export default function TextHeart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let points: Point[] = [];
    const baseFontSize = 14;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPoints();
    };

    const initPoints = () => {
      points = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) / 45;

      const textOptions = ["i love you", "I love you", "love you"];

      // 1. Outer Outline (s = 1.0)
      for (let t = 0; t < Math.PI * 2; t += 0.05) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        const pScale = 0.55 + Math.random() * 0.25;
        const pAngle = (Math.random() - 0.5) * 0.25;
        const randText = textOptions[Math.floor(Math.random() * textOptions.length)];
        
        points.push({
          x: centerX + x * scale,
          y: centerY + y * scale,
          alpha: 0,
          targetAlpha: 0.6 + Math.random() * 0.3,
          delay: Math.random() * 2000,
          scale: pScale,
          angle: pAngle,
          text: randText,
          color: `rgb(220, 20, 60)`, // Crimson outer
          shadowColor: `rgba(180, 0, 30, 0.8)`
        });
      }

      // 2. Inner Layers (s = 0.08 to 0.92)
      for (let s = 0.08; s < 1.0; s += 0.08) {
        const tStep = Math.min(0.5, 0.07 / s);
        for (let t = 0; t < Math.PI * 2; t += tStep) {
          const x = 16 * Math.pow(Math.sin(t), 3);
          const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
          
          let color = "";
          let shadowColor = "";
          
          if (s <= 0.35) {
            // Golden hot core
            color = `rgb(255, 235, 120)`;
            shadowColor = `rgba(255, 170, 0, 0.95)`;
          } else if (s <= 0.7) {
            // Neon pink-red middle layer
            color = `rgb(255, 60, 100)`;
            shadowColor = `rgba(255, 0, 80, 0.9)`;
          } else {
            // Deep crimson red outer layers
            color = `rgb(220, 20, 60)`;
            shadowColor = `rgba(180, 0, 30, 0.8)`;
          }
          
          const pScale = s < 0.35 
            ? (0.8 + Math.random() * 0.3) 
            : (s < 0.7 ? (0.7 + Math.random() * 0.2) : (0.55 + Math.random() * 0.25));
          const pAngle = (Math.random() - 0.5) * 0.3;
          const randText = textOptions[Math.floor(Math.random() * textOptions.length)];

          points.push({
            x: centerX + x * scale * s,
            y: centerY + y * scale * s,
            alpha: 0,
            targetAlpha: (s < 0.35 ? 0.75 : s < 0.7 ? 0.6 : 0.45) + Math.random() * 0.25,
            delay: Math.random() * 2500,
            scale: pScale,
            angle: pAngle,
            text: randText,
            color: color,
            shadowColor: shadowColor
          });
        }
      }
    };

    let start: number | null = null;
    const draw = (time: number) => {
      if (!start) start = time;
      const elapsed = time - start;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      points.forEach(p => {
        if (elapsed > p.delay) {
          p.alpha += (p.targetAlpha - p.alpha) * 0.02;
        }

        if (p.alpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          
          // Apply glow effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.shadowColor;
          
          const currentFontSize = baseFontSize * p.scale;
          ctx.font = `${currentFontSize}px "Fira Code", monospace`;
          ctx.fillStyle = p.color;
          
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          
          const textWidth = ctx.measureText(p.text).width;
          ctx.fillText(p.text, -textWidth / 2, currentFontSize / 2);
          
          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none"
    />
  );
}
