import React from 'react';

const WeeklyChart = ({ history }) => {
    // 1. Process Data
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Create array of last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push(d);
    }

    // Calculate totals per day
    const data = days.map(day => {
        const start = day.getTime();
        const end = start + 86400000;

        const totalSeconds = history
            .filter(h => h.timestamp >= start && h.timestamp < end)
            .reduce((acc, curr) => acc + curr.duration, 0);

        return {
            label: day.toLocaleDateString('en-US', { weekday: 'narrow' }),
            fullDate: day.toLocaleDateString(),
            minutes: Math.round(totalSeconds / 60)
        };
    });

    const maxVal = Math.max(...data.map(d => d.minutes), 60); // Min max is 1 hour

    return (
        <div className="w-full h-32 flex items-end justify-between gap-1 mt-4 mb-6">
            {data.map((d, i) => {
                const height = (d.minutes / maxVal) * 100;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-white text-black text-[10px] px-2 py-1 rounded transition-opacity whitespace-nowrap pointer-events-none z-10">
                            {d.fullDate}: {d.minutes}m
                        </div>

                        {/* Bar */}
                        <div className="w-full bg-white/5 rounded-t-sm h-full relative overflow-hidden">
                            <div
                                className="absolute bottom-0 w-full bg-white/20 hover:bg-white/40 transition-all duration-500 rounded-t-sm"
                                style={{ height: `${height}%` }}
                            />
                        </div>

                        {/* Label */}
                        <span className="text-[10px] text-white/30 uppercase">{d.label}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default WeeklyChart;
