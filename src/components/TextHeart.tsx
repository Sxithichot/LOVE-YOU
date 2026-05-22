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
  shadowBlur: number;
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
      for (let t = 0; t < Math.PI * 2; t += 0.04) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        const pScale = 0.55 + Math.random() * 0.2;
        const pAngle = (Math.random() - 0.5) * 0.25;
        const randText = textOptions[Math.floor(Math.random() * textOptions.length)];
        
        // Outline is bright Neon Red mixed with some Deep Crimson for depth
        const isNeon = Math.random() > 0.35;
        const color = isNeon ? `rgb(255, 10, 50)` : `rgb(140, 5, 20)`;
        const shadowColor = isNeon ? `rgba(255, 0, 50, 0.95)` : `rgba(100, 0, 15, 0.75)`;
        const targetAlpha = isNeon ? (0.75 + Math.random() * 0.25) : (0.45 + Math.random() * 0.25);
        const pShadowBlur = isNeon ? 15 : 8;

        points.push({
          x: centerX + x * scale,
          y: centerY + y * scale - 6 * scale,
          alpha: 0,
          targetAlpha: targetAlpha,
          delay: Math.random() * 2000,
          scale: pScale,
          angle: pAngle,
          text: randText,
          color: color,
          shadowColor: shadowColor,
          shadowBlur: pShadowBlur
        });
      }

      // 2. Inner Layers (s = 0.05 to 0.95)
      for (let s = 0.05; s < 1.0; s += 0.05) {
        const tStep = Math.min(0.5, 0.06 / s);
        for (let t = 0; t < Math.PI * 2; t += tStep) {
          const x = 16 * Math.pow(Math.sin(t), 3);
          const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
          
          let color = "";
          let shadowColor = "";
          let targetAlpha = 0.5 + Math.random() * 0.4;
          let pShadowBlur = 10;
          
          if (s <= 0.3) {
            // Glowing Warm Yellow/Orange core
            const rVal = Math.random();
            if (rVal < 0.45) {
              color = `rgb(255, 215, 0)`; // Glowing Golden Yellow
              shadowColor = `rgba(255, 160, 0, 0.95)`;
            } else if (rVal < 0.8) {
              color = `rgb(255, 130, 0)`; // Neon Orange
              shadowColor = `rgba(255, 60, 0, 0.95)`;
            } else {
              color = `rgb(255, 255, 200)`; // Highlight Bright Yellow-White
              shadowColor = `rgba(255, 210, 80, 0.95)`;
            }
            targetAlpha = 0.8 + Math.random() * 0.2;
            pShadowBlur = 15;
          } else if (s <= 0.6) {
            // Neon Red and Magenta/Deep Pink
            const isNeonRed = Math.random() > 0.5;
            if (isNeonRed) {
              color = `rgb(255, 20, 60)`; // Neon Red
              shadowColor = `rgba(255, 0, 50, 0.95)`;
            } else {
              color = `rgb(255, 0, 128)`; // Magenta/Deep Pink
              shadowColor = `rgba(255, 0, 128, 0.95)`;
            }
            targetAlpha = 0.65 + Math.random() * 0.3;
            pShadowBlur = 12;
          } else if (s <= 0.85) {
            // Magenta/Deep Pink and Crimson/Deep Red shadows
            const isMagenta = Math.random() > 0.6;
            if (isMagenta) {
              color = `rgb(255, 0, 100)`; // Magenta
              shadowColor = `rgba(255, 0, 100, 0.85)`;
              pShadowBlur = 10;
            } else {
              color = `rgb(160, 10, 25)`; // Crimson/Deep Red
              shadowColor = `rgba(120, 0, 15, 0.8)`;
              pShadowBlur = 7;
            }
            targetAlpha = 0.5 + Math.random() * 0.3;
          } else {
            // Outer boundaries: Crimson shadow blend with Neon Red highlights
            const isCrimson = Math.random() > 0.35;
            if (isCrimson) {
              color = `rgb(110, 5, 12)`; // Crimson shadow
              shadowColor = `rgba(70, 0, 5, 0.6)`;
              targetAlpha = 0.35 + Math.random() * 0.25;
              pShadowBlur = 5;
            } else {
              color = `rgb(255, 10, 50)`; // Neon Red highlight
              shadowColor = `rgba(255, 0, 50, 0.85)`;
              targetAlpha = 0.55 + Math.random() * 0.25;
              pShadowBlur = 12;
            }
          }
          
          const pScale = s < 0.3 
            ? (0.8 + Math.random() * 0.3) 
            : (s < 0.7 ? (0.65 + Math.random() * 0.2) : (0.5 + Math.random() * 0.2));
          const pAngle = (Math.random() - 0.5) * 0.25;
          const randText = textOptions[Math.floor(Math.random() * textOptions.length)];

          points.push({
            x: centerX + x * scale * s,
            y: centerY + y * scale * s - 6 * scale,
            alpha: 0,
            targetAlpha: targetAlpha,
            delay: Math.random() * 2500,
            scale: pScale,
            angle: pAngle,
            text: randText,
            color: color,
            shadowColor: shadowColor,
            shadowBlur: pShadowBlur
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
          
          // Apply custom glow
          ctx.shadowBlur = p.shadowBlur;
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
