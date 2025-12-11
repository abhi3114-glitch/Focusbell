import React, { useState, useEffect } from 'react';

const QUOTES = [
    "Focus is the key to all success.",
    "Do it now. Sometimes 'later' becomes 'never'.",
    "Great things never come from comfort zones.",
    "Dream big. Start small. Act now.",
    "Don't watch the clock; do what it does. Keep going.",
    "The secret of getting ahead is getting started.",
    "It always seems impossible until it's done.",
    "Focus on being productive instead of busy."
];

const QuoteWidget = () => {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        // Pick random on mount
        setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, []);

    return (
        <div className="text-center opacity-40 hover:opacity-80 transition-opacity duration-1000 mt-2 max-w-sm mx-auto">
            <p className="text-[10px] uppercase tracking-[0.2em] font-light leading-relaxed">
                "{quote}"
            </p>
        </div>
    );
};

export default QuoteWidget;
