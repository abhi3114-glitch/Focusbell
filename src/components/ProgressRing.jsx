import React from 'react';

// Using SVG for a smooth progress circle
const ProgressRing = ({ radius, stroke, progress, type = 'micro', colorOverride }) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Color mapping based on type/mode
    const colors = {
        micro: '#60A5FA', // Blue
        pomodoro: '#F87171', // Red
        break: '#34D399', // Green
        custom: '#A78BFA', // Purple
    };

    const color = colorOverride || colors[type] || colors.micro;

    return (
        <div className="relative flex items-center justify-center">
            <svg
                height={radius * 2}
                width={radius * 2}
                className="transform -rotate-90 transition-all duration-300"
            >
                <circle
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke={color}
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className="transition-all duration-300 ease-in-out" // animate the dash offset
                />
            </svg>
        </div>
    );
};

export default ProgressRing;
