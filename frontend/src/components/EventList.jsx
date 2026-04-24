import { useState } from "react";

// 🔹 Parser
const parseAnalysis = (text = "") => {
    const clean = text.replace(/\*\*/g, "");

    const get = (key) => {
        const match = clean.match(new RegExp(`${key}:\\s*(.*)`));
        return match ? match[1] : "";
    };

    return {
        type: get("Type"),
        risk: get("Risk Level"),
        summary: get("Summary"),
        explanation: get("Explanation"),
    };
};

export default function EventList({ events }) {
    const [selected, setSelected] = useState(null);

    return (
        <div className="bg-gray-900 p-5 rounded-2xl shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-white">
                Recent Activity
            </h3>

            {/* LIST */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto">
                {events.map((e, i) => (
                    <div
                        key={i}
                        onClick={() => setSelected(e)}
                        className="cursor-pointer p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
                    >
                        <p className="text-xs text-gray-500">
                            {e.sha.slice(0, 7)}
                        </p>

                        <p className="font-medium text-white">
                            {e.message || "No commit message"}
                        </p>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {selected && (() => {
                const parsed = parseAnalysis(selected.analysis);

                return (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <div className="bg-[#0f172a] p-6 rounded-2xl w-[600px] max-h-[80vh] overflow-y-auto border border-gray-800 space-y-5">

                            {/* HEADER */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-500">
                                        SHA: {selected.sha.slice(0, 7)}
                                    </p>
                                    <h2 className="text-xl font-bold text-white">
                                        {selected.message || "Commit Update"}
                                    </h2>
                                </div>

                                <span
                                    className={`text-xs px-3 py-1 rounded-full ${parsed.risk === "High"
                                            ? "bg-red-500/20 text-red-400"
                                            : parsed.risk === "Medium"
                                                ? "bg-yellow-500/20 text-yellow-400"
                                                : "bg-green-500/20 text-green-400"
                                        }`}
                                >
                                    {parsed.risk || "Low"} Risk
                                </span>
                            </div>

                            {/* TYPE */}
                            <div className="bg-gray-800/60 p-4 rounded-lg">
                                <p className="text-xs text-gray-400 mb-1">TYPE</p>
                                <p className="text-white font-semibold">
                                    {parsed.type || "Unknown"}
                                </p>
                            </div>

                            {/* SUMMARY */}
                            <div className="bg-gray-800/60 p-4 rounded-lg">
                                <p className="text-xs text-gray-400 mb-1">SUMMARY</p>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {parsed.summary || "No summary available"}
                                </p>
                            </div>

                            {/* EXPLANATION */}
                            <details className="bg-gray-800/60 p-4 rounded-lg">
                                <summary className="cursor-pointer text-blue-400 text-sm">
                                    View Detailed Explanation
                                </summary>

                                <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                                    {parsed.explanation || "No explanation available"}
                                </p>
                            </details>

                            {/* CLOSE BUTTON */}
                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-medium"
                                onClick={() => setSelected(null)}
                            >
                                Close
                            </button>

                        </div>
                    </div>
                );
            })()}
        </div>
    );
}