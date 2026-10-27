// src/components/analytics/LineChart.jsx
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

// Преобразуем { months: [], values: [] } → [{ month, value }, ...]
function toChartData({ months = [], values = [] }) {
  return months.map((month, i) => ({
    month,
    value: values[i] ?? 0,
  }));
}

export default function LineChart({ data, height = 380 }) {
  const { color } = data;
  const chartData = toChartData(data);

  return (
    <div className="w-full flex flex-col gap-4">
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
        >
          {/* Горизонтальные линии сетки */}
          <CartesianGrid
            strokeDasharray="0"
            stroke="#E5E3DA"
            vertical={false}
          />

          {/* X — месяцы */}
          <XAxis
            dataKey="month"
            interval={0}
            axisLine={false}
            tickLine={false}
            tick={{
              fill: '#697077',
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
            dy={8}
          />

          {/* Y — числа (скрыты, но нужны для масштаба) */}
          <YAxis
            hide
            domain={[0, 'dataMax + 1']}
          />

          {/* Тултип при наведении */}
          <Tooltip
            cursor={{ stroke: '#C7C7C7', strokeWidth: 1 }}
            contentStyle={{
              backgroundColor: '#F3F2EC',
              border: '1px solid #94928B',
              borderRadius: 8,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 14,
            }}
            labelStyle={{ color: '#697077' }}
            formatter={(value) => [`${value} книг`, 'Прочитано']}
            labelFormatter={(label) => `Месяц: ${label}`}
          />

          {/* Линия */}
          <Line
            type="linear"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{
              r: 4,
              fill: color,
              stroke: color,
              strokeWidth: 0,
            }}
            activeDot={{
              r: 6,
              fill: color,
              stroke: '#F3F2EC',
              strokeWidth: 2,
            }}
            isAnimationActive={false}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}