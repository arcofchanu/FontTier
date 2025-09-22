import React, { useRef, useEffect } from 'react';

const LiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: -200, y: -200 };

    const colors = ['#FF7F50', '#F07040', '#FFA07A', '#FFDAB9'];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };
    
    class Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 15 + 5; // 5 to 20
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.vx = (Math.random() - 0.5) * 0.5; // Slow velocity
        this.vy = (Math.random() - 0.5) * 0.5;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color + '80'; // Add some transparency
        ctx.fill();
      }

      update() {
        // Wall collision
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.vx = -this.vx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.vy = -this.vy;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100;
        
        if (distance < maxDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (maxDistance - distance) / maxDistance;
            this.x -= forceDirectionX * force * 0.5;
            this.y -= forceDirectionY * force * 0.5;
        }
      }
    }

    const createParticles = () => {
        particles = [];
        const particleCount = (canvas.width * canvas.height) / 9000;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    resizeCanvas();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
};

export default LiveBackground;
