import React, { useState } from 'react';

const SessionTasks = ({ tasks = [], onTasksChange }) => {
    const [newTask, setNewTask] = useState('');

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        onTasksChange([...tasks, { id: Date.now(), text: newTask.trim(), completed: false }]);
        setNewTask('');
    };

    const toggleTask = (id) => {
        onTasksChange(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const removeTask = (id) => {
        onTasksChange(tasks.filter(t => t.id !== id));
    };

    return (
        <div className="w-full max-w-xs mt-6">
            <div className="space-y-2 mb-3 max-h-[120px] overflow-y-auto custom-scrollbar">
                {tasks.map(task => (
                    <div key={task.id} className="group flex items-center gap-2 text-sm text-white/80 bg-white/5 p-2 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                        <button
                            onClick={() => toggleTask(task.id)}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${task.completed ? 'bg-blue-500 border-blue-500' : 'border-white/30 hover:border-white/50'}`}
                        >
                            {task.completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </button>
                        <span className={`flex-1 truncate ${task.completed ? 'line-through text-white/30' : ''}`}>
                            {task.text}
                        </span>
                        <button
                            onClick={() => removeTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 p-1"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <form onSubmit={addTask} className="relative">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a sub-task..."
                    className="w-full bg-white/5 text-xs text-white p-2.5 rounded-lg border border-transparent focus:border-white/20 focus:outline-none focus:bg-white/10 transition-colors pr-8"
                />
                <button
                    type="submit"
                    disabled={!newTask.trim()}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-white/30 hover:text-blue-400 disabled:opacity-0 transition-all font-bold"
                >
                    +
                </button>
            </form>
        </div>
    );
};

export default SessionTasks;
