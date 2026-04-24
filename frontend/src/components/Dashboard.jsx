import { useState } from "react";
import axios from "axios";
import RepoInput from "./RepoInput";
import StatsCards from "./StatsCards";
import ActivityChart from "./ActivityChart";
import EventList from "./EventList";

const API_URL = import.meta.env.VITE_API_URL;
export default function Dashboard() {
    const [events, setEvents] = useState([]);
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

    return (
        <div className="min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-6">
                🚀 AI DevOps Dashboard
            </h1>

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