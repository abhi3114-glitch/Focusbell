import React, { useState } from 'react';

const GoalWidget = ({ todayTotal, dailyGoal, streak, onGoalChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const percentage = Math.min((todayTotal / dailyGoal) * 100, 100);

    const handleGoalUpdate = (e) => {
        const val = parseInt(e.target.value);
        // Valid range: 1 min to 12 hours
        if (!isNaN(val) && val > 0 && val <= 720) {
            onGoalChange(val * 60);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleGoalUpdate(e);
        if (e.key === 'Escape') setIsEditing(false);
    };

    return (
        <div className="flex gap-4 text-xs font-medium text-white/50 select-none">

            {/* Streak */}
            <div className="flex flex-col items-center">
                <span className="text-orange-400 text-lg font-bold flex items-center">
                    {streak} <span className="text-base ml-0.5">🔥</span>
                </span>
                <span className="uppercase tracking-wider text-[10px]">Streak</span>
            </div>

            {/* Daily Goal */}
            <div className="flex flex-col items-start gap-1 w-24 relative group">
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {isEditing ? (
                    <div className="absolute top-0 left-0 w-full min-w-[120px] bg-gray-800 p-2 rounded-lg border border-white/20 z-50 shadow-xl">
                        <label className="block text-[10px] uppercase mb-1 text-white/70">Set Goal (mins):</label>
                        <input
                            autoFocus
                            type="number"
                            defaultValue={Math.floor(dailyGoal / 60)}
                            onBlur={handleGoalUpdate}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-white/10 text-white p-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                ) : (
                    <div
                        className="flex justify-between w-full text-[10px] uppercase tracking-wide cursor-pointer hover:text-white transition-colors"
                        onClick={() => setIsEditing(true)}
                        title="Click to set daily goal"
                    >
                        <span>Daily Goal</span>
                        <span className={percentage >= 100 ? 'text-green-400' : ''}>
                            {Math.floor(percentage)}%
                        </span>
                    </div>
                )}
            </div>

        </div>
    );
};

export default GoalWidget;
