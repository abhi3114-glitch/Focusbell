import React from 'react';
import WeeklyChart from './WeeklyChart';

const History = ({ isOpen, onClose, history, theme }) => {
    if (!isOpen) return null;

    const downloadHistory = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "focusbell-history.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const exportCSV = () => {
        const headers = ["Timestamp", "Date", "Mode", "Duration (sec)", "Intent"];
        const rows = history.map(h => [
            h.timestamp,
            new Date(h.timestamp).toLocaleString().replace(/,/g, ''),
            h.mode,
            h.duration,
            `"${h.intent || ''}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "focusbell_data.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const importHistory = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);
                    if (Array.isArray(imported)) {
                        localStorage.setItem('focusbell_history', JSON.stringify(imported));
                        window.location.reload();
                    }
                } catch (err) {
                    alert('Invalid history file');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-md ${theme?.classes?.bg || 'bg-gray-900'} border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]`}>
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <h2 className="text-xl font-light tracking-wide text-white">Session History</h2>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="px-6 pt-6">
                    <WeeklyChart history={history} />
                </div>

                <div className="overflow-y-auto flex-1 px-6 pb-6 space-y-3">
                    {history.length === 0 ? (
                        <div className="text-center text-white/30 py-8 italic">No sessions recorded yet.</div>
                    ) : (
                        history.slice().reverse().map((entry, i) => (
                            <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                <div>
                                    <div className="text-sm font-medium text-white/90">{entry.intent || entry.mode}</div>
                                    <div className="text-xs text-white/40">{new Date(entry.timestamp).toLocaleDateString()} • {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                                <div className="text-white/60 font-mono text-sm">
                                    {Math.floor(entry.duration / 60)}m
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-white/5 bg-black/20 flex gap-2">
                    <button onClick={downloadHistory} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs uppercase tracking-wider text-white/60 hover:text-white transition-colors font-medium">
                        JSON
                    </button>
                    <button onClick={exportCSV} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs uppercase tracking-wider text-white/60 hover:text-white transition-colors font-medium">
                        CSV
                    </button>
                    <button onClick={importHistory} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs uppercase tracking-wider text-white/60 hover:text-white transition-colors font-medium">
                        Import
                    </button>
                </div>

            </div>
        </div>
    );
};

export default History;
