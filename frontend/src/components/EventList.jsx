import { useState } from "react";

export default function EventList({ events }) {
    const [selected, setSelected] = useState(null);

    return (
        <div className="bg-gray-900 p-5 rounded-2xl shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">
                Recent Activity
            </h3>

            <div className="space-y-3 max-h-[350px] overflow-y-auto">
                {events.map((e, i) => (
                    <div
                        key={i}
                        onClick={() => setSelected(e)}
                        className="cursor-pointer p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
                    >
                        <p className="text-sm text-gray-400">
                            {e.sha.slice(0, 7)}
                        </p>

                        <p className="font-medium">
                            {e.message || "No commit message"}
                        </p>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {selected && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="bg-gray-900 p-6 rounded-xl w-[600px] max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-2">
                            Commit Details
                        </h2>

                        <p className="text-gray-400 mb-2">
                            SHA: {selected.sha}
                        </p>

                        <p className="mb-4 font-semibold">
                            {selected.message}
                        </p>

                        <pre className="text-sm whitespace-pre-wrap text-gray-300">
                            {selected.analysis}
                        </pre>

                        <button
                            className="mt-4 bg-blue-600 px-4 py-2 rounded"
                            onClick={() => setSelected(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}