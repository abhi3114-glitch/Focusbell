import React, { useEffect, useState } from 'react';

const Confetti = ({ active }) => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        if (active) {
            const count = 50;
            const newParticles = [];
            for (let i = 0; i < count; i++) {
                newParticles.push({
                    id: i,
                    x: Math.random() * 100, // vw
                    y: -10, // start above
                    color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)],
                    delay: Math.random() * 2,
                    duration: 3 + Math.random() * 2
                });
            }
            setParticles(newParticles);

            // Cleanup
            const timer = setTimeout(() => setParticles([]), 6000);
            return () => clearTimeout(timer);
        }
    }, [active]);

    if (!active || particles.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute w-2 h-2 rounded-full animate-fall"
                    style={{
                        left: `${p.x}vw`,
                        backgroundColor: p.color,
                        top: '-10px',
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                        opacity: 0.8
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
                }
                .animate-fall {
                    animation-name: fall;
                    animation-timing-function: linear;
                    animation-fill-mode: forwards;
                }
            `}</style>
        </div>
    );
};

export default Confetti;
