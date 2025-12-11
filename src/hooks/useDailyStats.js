import { useState, useEffect } from 'react';

export const useDailyStats = (history) => {
    const [dailyGoal, setDailyGoal] = useState(() => {
        return parseInt(localStorage.getItem('focusbell_daily_goal')) || 4 * 60 * 60; // Default 4 hours
    });

    const [stats, setStats] = useState({
        todayTotal: 0,
        currentStreak: 0
    });

    useEffect(() => {
        localStorage.setItem('focusbell_daily_goal', dailyGoal);
    }, [dailyGoal]);

    useEffect(() => {
        // Recalculate stats when history changes
        const today = new Date().setHours(0, 0, 0, 0);

        // 1. Calculate today's total
        const todaySessions = history.filter(s => s.timestamp >= today);
        const todayTotal = todaySessions.reduce((acc, curr) => acc + curr.duration, 0);

        // 2. Calculate Streak
        // Get unique dates from history
        const dates = [...new Set(history.map(s => new Date(s.timestamp).setHours(0, 0, 0, 0)))].sort((a, b) => b - a);

        let streak = 0;
        let expectedDate = today;

        // Check if we focused today
        const focusedToday = dates.includes(today);

        // If not focused today, check yesterday for streak continuation
        if (!focusedToday) {
            expectedDate = today - 86400000; // Yesterday
        }

        for (let date of dates) {
            if (date === expectedDate) {
                streak++;
                expectedDate -= 86400000;
            } else {
                break;
            }
        }

        setStats({
            todayTotal,
            currentStreak: streak
        });

    }, [history]);

    return {
        dailyGoal,
        setDailyGoal,
        todayTotal: stats.todayTotal,
        currentStreak: stats.currentStreak
    };
};
