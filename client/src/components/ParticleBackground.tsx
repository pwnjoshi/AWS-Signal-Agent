import React, { useEffect, useRef } from 'react';

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let mouse = { x: null as number | null, y: null as number | null, radius: 150 };

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseSize: number;
      angle: number;
      spinSpeed: number;
      update: () => void;
      draw: () => void;
    }

    const createParticle = (): Particle => {
      const p = {
        x: Math.random() * (canvas?.width || 800),
        y: Math.random() * (canvas?.height || 600),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 6 + 4,
        baseSize: Math.random() * 6 + 4,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.02,
        update() {
          if (!canvas) return;
          this.x += this.vx;
          this.y += this.vy;
          this.angle += this.spinSpeed;

          if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

          if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
              const force = (mouse.radius - dist) / mouse.radius;
              this.x += (dx / dist) * force * 1.5;
              this.y += (dy / dist) * force * 1.5;
              this.size = this.baseSize + force * 4;
            } else {
              if (this.size > this.baseSize) this.size -= 0.1;
            }
          } else {
            if (this.size > this.baseSize) this.size -= 0.1;
          }
        },
        draw() {
          if (!ctx) return;
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.angle);

          ctx.beginPath();
          ctx.moveTo(-this.size / 2, 0);
          ctx.lineTo(0, -this.size / 2);
          ctx.lineTo(this.size / 2, 0);
          ctx.lineTo(0, this.size / 2);
          ctx.closePath();

          ctx.strokeStyle = 'rgba(173, 92, 255, 0.85)';
          ctx.fillStyle = 'rgba(173, 92, 255, 0.15)';
          ctx.lineWidth = 1;

          ctx.fill();
          ctx.stroke();

          ctx.restore();
        }
      };
      return p;
    };

    const isTouchOrMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    const maxParticles = isTouchOrMobile ? 20 : 80;
    const particleCount = Math.min(Math.floor(((canvas.width * canvas.height) / (isTouchOrMobile ? 35000 : 14000))), maxParticles);
    
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      if (!isTouchOrMobile) {
        particles.forEach((p1, i) => {
          particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 110) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(173, 92, 255, ${0.18 * (1 - distance / 110)})`;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          });
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0"
    />
  );
};
export default ParticleBackground;
