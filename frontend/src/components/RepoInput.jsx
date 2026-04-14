import { useState } from "react";

export default function RepoInput({ onSubmit }) {
    const [repo, setRepo] = useState("");

    return (
        <div className="flex gap-3">
            <input
                className="bg-gray-800 px-4 py-2 rounded w-full outline-none"
                placeholder="username/repo"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
            />
            <button
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
                onClick={() => onSubmit(repo)}
            >
                Load
            </button>
        </div>
    );
}