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
    const data = events.map((_, i) => ({
        index: i + 1,
        commits: i + 1,
    }));

    return (
        <div className="bg-gray-900 p-5 rounded-2xl shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">
                Commit Activity
            </h3>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                    <XAxis dataKey="index" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="commits"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}