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
    let currentScale = 1;
    const getBaseFontSize = (scale: number) => {
      return Math.max(9, Math.min(14, scale * 0.7));
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      initPoints();
    };

    const initPoints = () => {
      points = [];
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      currentScale = Math.min(window.innerWidth, window.innerHeight) / 45;
      const scale = currentScale;

      const textOptions = ["i love you", "I love you", "love you"];

      // 1. Outer Outline (s = 1.0)
      for (let t = 0; t < Math.PI * 2; t += 0.04) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        const pScale = 0.55 + Math.random() * 0.2;
        const pAngle = (Math.random() - 0.5) * 0.25;
        const randText = textOptions[Math.floor(Math.random() * textOptions.length)];
        
        // Border is Neon Red (80% weight) mixed with some Crimson (20% weight)
        const isNeon = Math.random() > 0.2;
        const color = isNeon ? `rgb(255, 30, 79)` : `rgb(155, 17, 30)`; // #FF1E4F vs Crimson
        const shadowColor = isNeon ? `rgba(255, 30, 79, 0.95)` : `rgba(120, 10, 20, 0.75)`;
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
            // Intense core: Off-white / light pink core with a vibrant pinkish-red glow
            color = `rgb(255, 240, 243)`; 
            shadowColor = `rgba(255, 30, 79, 0.95)`; // #FF1E4F glow
            targetAlpha = 0.85 + Math.random() * 0.15;
            pShadowBlur = 15;
          } else if (s <= 0.65) {
            // Neon Red and Magenta/Deep Pink
            const isNeonRed = Math.random() > 0.6;
            if (isNeonRed) {
              color = `rgb(255, 30, 79)`; // Neon Red (#FF1E4F)
              shadowColor = `rgba(255, 30, 79, 0.95)`;
            } else {
              color = `rgb(255, 0, 127)`; // Magenta / Deep Pink (#FF007F)
              shadowColor = `rgba(255, 0, 127, 0.95)`;
            }
            targetAlpha = 0.65 + Math.random() * 0.3;
            pShadowBlur = 12;
          } else if (s <= 0.85) {
            // Quinacridone Magenta and Crimson/Deep Red shadows
            const isMagenta = Math.random() > 0.5;
            if (isMagenta) {
              color = `rgb(227, 28, 121)`; // Quinacridone Magenta
              shadowColor = `rgba(227, 28, 121, 0.85)`;
              pShadowBlur = 10;
            } else {
              color = `rgb(155, 17, 30)`; // Crimson/Deep Red (#9B111E)
              shadowColor = `rgba(120, 0, 15, 0.8)`;
              pShadowBlur = 7;
            }
            targetAlpha = 0.5 + Math.random() * 0.3;
          } else {
            // Outer boundaries: Crimson shadow blend with Neon Red highlights
            const isCrimson = Math.random() > 0.3;
            if (isCrimson) {
              color = `rgb(110, 5, 12)`; // Deep Crimson shadow
              shadowColor = `rgba(70, 0, 5, 0.55)`;
              targetAlpha = 0.3 + Math.random() * 0.25;
              pShadowBlur = 5;
            } else {
              color = `rgb(255, 30, 79)`; // Neon Red highlight
              shadowColor = `rgba(255, 30, 79, 0.85)`;
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
          
          const baseFontSize = getBaseFontSize(currentScale);
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
