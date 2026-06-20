import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

const colors = ["#D56B45", "#F7C353", "#45D57C", "#FAF3F0", "#2D2D2D"];

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  velocity: number;
  rotation: number;
}

export default React.memo(function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 60; i++) {
      newParticles.push({
        id: i,
        x: 50, // Start from center width
        y: 100, // Start from bottom
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        angle: Math.random() * Math.PI + Math.PI, // Shoot upwards
        velocity: Math.random() * 80 + 40,
        rotation: Math.random() * 360,
      });
    }
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[400] overflow-hidden">
      {particles.map((p) => {
        // Calculate end point based on angle and velocity
        const targetX = p.x + Math.cos(p.angle) * p.velocity;
        const targetY = p.y + Math.sin(p.angle) * p.velocity + 150; // Add gravity

        return (
          <motion.div
            key={p.id}
            initial={{ 
              x: `${p.x}vw`, 
              y: `100vh`, 
              rotate: 0,
              opacity: 1,
              scale: 0 
            }}
            animate={{ 
              x: `${targetX}vw`, 
              y: `${targetY}vh`, 
              rotate: p.rotation * 4,
              opacity: [1, 1, 0],
              scale: [0, 1, 1] 
            }}
            transition={{ 
              duration: 2.5 + Math.random(), 
              ease: "easeOut" 
            }}
            className="absolute w-2 h-2 rounded-sm"
            style={{ 
              backgroundColor: p.color,
              width: p.size,
              height: p.size,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px"
            }}
          />
        );
      })}
    </div>
  );
});
