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

    // ✅ Empty state
    if (!events || events.length === 0) {
        return (
            <div className="bg-[#0f172a] p-6 rounded-2xl border border-gray-800 text-gray-400">
                No activity data available
            </div>
        );
    }

    // 🔥 GROUP BY TIME (fix for single dot issue)
    const grouped = {};

    events.forEach((e) => {
        const time = new Date(e.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        if (!grouped[time]) grouped[time] = 0;
        grouped[time] += 1;
    });

    // 🔥 SORT TIME PROPERLY
    let data = Object.keys(grouped)
        .sort((a, b) => {
            const t1 = new Date(`1970/01/01 ${a}`);
            const t2 = new Date(`1970/01/01 ${b}`);
            return t1 - t2;
        })
        .map((time) => ({
            time,
            commits: grouped[time],
        }));

    // ⚠️ FALLBACK: if still only 1 point → use index-based chart
    if (data.length <= 1) {
        data = events.map((_, i) => ({
            time: `#${i + 1}`,
            commits: i + 1,
        }));
    }

    return (
        <div className="bg-[#0f172a] p-6 rounded-2xl shadow-xl border border-gray-800">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">
                    Commit Activity
                </h3>
                <span className="text-xs text-gray-400">
                    {data.length} points tracked
                </span>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>

                    {/* Gradient */}
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
                        dataKey="time"
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
                        labelFormatter={(label) => `Time: ${label}`}
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

                        // ✅ SHOW DOTS
                        dot={{
                            r: 3,
                            fill: "#3b82f6",
                            stroke: "#0f172a",
                            strokeWidth: 2,
                        }}

                        // ✅ HOVER DOT (bigger)
                        activeDot={{
                            r: 6,
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