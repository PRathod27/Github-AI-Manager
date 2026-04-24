import { useState, useEffect } from "react";
import axios from "axios";
import RepoInput from "./RepoInput";
import StatsCards from "./StatsCards";
import ActivityChart from "./ActivityChart";
import EventList from "./EventList";

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // 🔍 Debug API URL
    useEffect(() => {
        console.log("🌐 API URL:", API_URL);

        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(storedUser);
    }, []);

    // 🚀 Fetch repo data
    const fetchData = async (repo) => {
        setLoading(true);

        try {
            console.log("📦 Fetching repo:", repo);

            const res = await axios.get(
                `${API_URL}/api/events?repo=${repo}`
            );

            console.log("✅ Response:", res.data);

            setEvents(Array.isArray(res.data) ? res.data.reverse() : []);

        } catch (err) {
            console.error("❌ API ERROR:", err);

            if (err.response) {
                alert(`Server Error: ${err.response.status}`);
            } else if (err.request) {
                alert("Network Error: Backend not reachable or sleeping");
            } else {
                alert("Unexpected Error occurred");
            }

        } finally {
            setLoading(false);
        }
    };

    // 🔐 Login
    const handleLogin = () => {
        window.location.href = `${API_URL}/auth/login`;
    };

    // 🚪 Logout
    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <div className="min-h-screen p-6">

            {/* 🔥 HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    🚀 AI DevOps Dashboard
                </h1>

                {user ? (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-300">
                            👋 {user}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-3 py-1 rounded text-sm"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleLogin}
                        className="bg-blue-600 px-4 py-2 rounded"
                    >
                        Login with GitHub
                    </button>
                )}
            </div>

            {/* 📦 Repo Input */}
            <RepoInput onSubmit={fetchData} />

            {/* ⏳ Loading */}
            {loading && (
                <p className="mt-4 text-blue-400">
                    Loading data... (backend may be waking up)
                </p>
            )}

            {/* 📊 Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <StatsCards events={events} />
            </div>

            {/* 📈 Charts + Events */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
                <ActivityChart events={events} />
                <EventList events={events} />
            </div>
        </div>
    );
}