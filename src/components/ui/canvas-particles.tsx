import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
  colorIndex: number;
  size: number;
}

export default function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const particleCount = 120;
    const fov = 400; // Field of View (perspective)
    
    // Palette of Gold and Soft Cosmic Blue
    const colors = [
      "rgba(191, 149, 63, 0.45)", // Gold
      "rgba(252, 246, 186, 0.5)",  // Light Gold
      "rgba(179, 135, 40, 0.4)",   // Dark Gold
      "rgba(29, 78, 216, 0.25)",   // Deep Blue
      "rgba(96, 165, 250, 0.3)",   // Light Blue
    ];

    const lightColors = [
      "rgba(179, 135, 40, 0.65)",   // Darker Gold
      "rgba(191, 149, 63, 0.7)",    // Gold
      "rgba(140, 95, 20, 0.6)",     // Richer Gold
      "rgba(29, 78, 216, 0.45)",    // Deep Blue
      "rgba(37, 99, 235, 0.5)",     // Vibrant Blue
    ];

    // Initialize particles in 3D sphere shape
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 150 + Math.random() * 250; // Distance from center
      const colorIndex = Math.floor(Math.random() * colors.length);

      particles.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.4,
        color: colors[colorIndex],
        colorIndex,
        size: 1.2 + Math.random() * 1.8,
      });
    }

    // Handles screen resizing
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Tracks mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX - width / 2;
      mouseRef.current.y = e.clientY - height / 2;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Slow rotation velocity around axes
    const rotSpeedY = 0.0006;
    const rotSpeedX = 0.0002;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Check if light mode is active
      const isLight = document.documentElement.classList.contains("light");

      // Radial background glow (Deep space cosmic look / premium white look)
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      if (isLight) {
        grad.addColorStop(0, "rgba(253, 251, 247, 1)");
        grad.addColorStop(0.6, "rgba(250, 250, 250, 1)");
        grad.addColorStop(1, "rgba(240, 240, 240, 1)");
      } else {
        grad.addColorStop(0, "rgba(8, 10, 24, 1)");
        grad.addColorStop(0.5, "rgba(2, 2, 4, 1)");
        grad.addColorStop(1, "rgba(0, 0, 0, 1)");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Cache projected positions for drawing lines between close nodes
      const projected: { sx: number; sy: number; z: number; color: string }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 3D Rotations
        // Rotate Y
        let cosY = Math.cos(rotSpeedY);
        let sinY = Math.sin(rotSpeedY);
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;

        // Rotate X
        let cosX = Math.cos(rotSpeedX);
        let sinX = Math.sin(rotSpeedX);
        let y1 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        // Apply velocities & keep bounded
        p.x = x1 + p.vx;
        p.y = y1 + p.vy;
        p.z = z2 + p.vz;

        // Soft attraction to mouse
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 300) {
            p.x += dx * 0.001;
            p.y += dy * 0.001;
          }
        }

        // Project onto 2D viewport
        const distanceZ = p.z + 500; // Offset camera distance
        if (distanceZ <= 0) continue;

        const scale = fov / distanceZ;
        const sx = p.x * scale + width / 2;
        const sy = p.y * scale + height / 2;

        const pColor = isLight ? lightColors[p.colorIndex] : p.color;
        projected.push({ sx, sy, z: p.z, color: pColor });

        // Draw particle node
        ctx.beginPath();
        ctx.arc(sx, sy, p.size * scale * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = pColor;
        ctx.shadowColor = pColor;
        ctx.shadowBlur = isActiveGold(pColor) ? (isLight ? 4 : 10) : 0;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }

      // Draw constellation link lines (neural networks)
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dx = p1.sx - p2.sx;
          const dy = p1.sy - p2.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect if they are close enough in 2D space
          if (dist < 90) {
            const alpha = isLight ? (1 - dist / 90) * 0.18 : (1 - dist / 90) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            
            // Set line color
            ctx.strokeStyle = isLight 
              ? `rgba(179, 135, 40, ${alpha})`
              : `rgba(191, 149, 63, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const isActiveGold = (color: string) => {
      return color.includes("191") || color.includes("252");
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}
