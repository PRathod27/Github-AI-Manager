export default function StatsCards({ events }) {
    const total = events.length;

    const repos = new Set(events.map((e) => e.repo)).size;

    return (
        <>
            <div className="bg-gray-900 p-5 rounded-2xl shadow">
                <p className="text-gray-400">Total Events</p>
                <h2 className="text-2xl font-bold">{total}</h2>
            </div>

            <div className="bg-gray-900 p-5 rounded-2xl shadow">
                <p className="text-gray-400">Repositories</p>
                <h2 className="text-2xl font-bold">{repos}</h2>
            </div>

            <div className="bg-gray-900 p-5 rounded-2xl shadow">
                <p className="text-gray-400">AI Insights</p>
                <h2 className="text-2xl font-bold">
                    {events.length ? "Active" : "None"}
                </h2>
            </div>
        </>
    );
}