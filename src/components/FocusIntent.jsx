import React, { useState } from 'react';

const FocusIntent = ({ intent, onIntentChange }) => {
    return (
        <div className="w-full max-w-sm mx-auto mt-4 px-4">
            <input
                type="text"
                value={intent}
                onChange={(e) => onIntentChange(e.target.value)}
                placeholder="I am focusing on..."
                className="w-full bg-transparent text-center text-white/70 placeholder-white/20 text-lg border-b border-transparent focus:border-white/20 focus:outline-none transition-colors pb-1"
            />
        </div>
    );
};

export default FocusIntent;
