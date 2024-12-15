"use client";

import { useEffect, useRef } from 'react';

interface MatrixSymbol {
  x: number;
  y: number;
  value: string;
  speed: number;
  opacity: number;
}

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix symbols configuration
    const fontSize = 14;
    const columns = Math.ceil(canvas.width / fontSize);
    const symbols: MatrixSymbol[] = [];

    // Generate katakana characters and numbers
    const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const chars = katakana + latin + nums;

    // Initialize symbols
    for (let i = 0; i < columns; i++) {
      symbols.push({
        x: i * fontSize,
        y: Math.random() * canvas.height,
        value: chars[Math.floor(Math.random() * chars.length)],
        speed: 1 + Math.random() * 3,
        opacity: Math.random()
      });
    }

    // Animation loop
    const draw = () => {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw symbols
      symbols.forEach(symbol => {
        // Random chance to change symbol
        if (Math.random() < 0.02) {
          symbol.value = chars[Math.floor(Math.random() * chars.length)];
        }

        // Set color and opacity
        const green = Math.floor(symbol.opacity * 165); // Varying shades of green
        ctx.fillStyle = `rgba(159, ${green + 90}, 0, ${symbol.opacity})`;
        ctx.font = `${fontSize}px monospace`;

        // Draw the symbol
        ctx.fillText(symbol.value, symbol.x, symbol.y);

        // Move symbol down
        symbol.y += symbol.speed;

        // Reset position if symbol goes off screen
        if (symbol.y > canvas.height) {
          symbol.y = 0;
          symbol.opacity = Math.random();
          symbol.speed = 1 + Math.random() * 3;
        }
      });
    };

    // Run animation
    const interval = setInterval(draw, 33); // Approximately 30 FPS

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="matrix-bg"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.15
      }}
    />
  );
};

export default MatrixBackground; 