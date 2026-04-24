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

    // ✅ Load user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(storedUser);
    }, []);

    // ✅ Fetch repo data
    const fetchData = async (repo) => {
        try {
            const res = await axios.get(
                `${API_URL}/api/events?repo=${repo}`
            );
            setEvents(res.data.reverse());
        } catch (err) {
            console.error(err);
        }
    };

    // ✅ Login redirect
    const handleLogin = () => {
        window.location.href = `${API_URL}/auth/login`;
    };

    // ✅ Logout
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

            {/* EXISTING UI */}
            <RepoInput onSubmit={fetchData} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <StatsCards events={events} />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
                <ActivityChart events={events} />
                <EventList events={events} />
            </div>
        </div>
    );
}