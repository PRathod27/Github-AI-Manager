import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

export default function ActivityChart({ events }) {

    // 🧠 Handle empty state
    if (!events || events.length === 0) {
        return (
            <div className="bg-[#0f172a] p-6 rounded-2xl border border-gray-800 text-gray-400">
                No activity data available
            </div>
        );
    }

    // 🧠 Group commits by date
    const grouped = {};

    events.forEach((e) => {
        const date = new Date(e.created_at).toLocaleDateString();

        if (!grouped[date]) grouped[date] = 0;
        grouped[date] += 1;
    });

    // ✅ Sort dates properly
    const data = Object.keys(grouped)
        .sort((a, b) => new Date(a) - new Date(b))
        .map((date) => ({
            date,
            commits: grouped[date],
        }));

    return (
        <div className="bg-[#0f172a] p-6 rounded-2xl shadow-xl border border-gray-800">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">
                    Commit Activity
                </h3>
                <span className="text-xs text-gray-400">
                    {data.length} days tracked
                </span>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>

                    {/* 🔥 Gradient */}
                    <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                        </linearGradient>
                    </defs>

                    {/* Grid */}
                    <CartesianGrid
                        stroke="#1f2937"
                        strokeDasharray="3 3"
                        vertical={false}
                    />

                    {/* X Axis */}
                    <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />

                    {/* Y Axis */}
                    <YAxis
                        stroke="#6b7280"
                        tickLine={false}
                        axisLine={false}
                    />

                    {/* Tooltip */}
                    <Tooltip
                        formatter={(value) => [`${value} commits`, "Activity"]}
                        labelFormatter={(label) => `Date: ${label}`}
                        contentStyle={{
                            backgroundColor: "#020617",
                            border: "1px solid #1f2937",
                            borderRadius: "8px",
                            fontSize: "12px",
                        }}
                        labelStyle={{ color: "#94a3b8" }}
                        itemStyle={{ color: "#3b82f6" }}
                    />

                    {/* Line */}
                    <Line
                        type="monotone"
                        dataKey="commits"
                        stroke="url(#colorGradient)"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{
                            r: 5,
                            fill: "#3b82f6",
                            stroke: "#0f172a",
                            strokeWidth: 2,
                        }}
                    />

                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}