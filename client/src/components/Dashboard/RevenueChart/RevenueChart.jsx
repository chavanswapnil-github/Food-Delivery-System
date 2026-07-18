import "./RevenueChart.css";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", revenue: 18000 },
  { month: "Feb", revenue: 25000 },
  { month: "Mar", revenue: 22000 },
  { month: "Apr", revenue: 34000 },
  { month: "May", revenue: 42000 },
  { month: "Jun", revenue: 52000 },
];

function RevenueChart() {
  return (
    <div className="chart-card">
      <h2>Revenue Overview</h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid stroke="#334155" />
          <XAxis dataKey="month" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#ff6b35"
            strokeWidth={4}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;