// src/components/analytics/BarChart.jsx
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

// Преобразуем { months: [], values: [] } → [{ month, value }, ...]
function toChartData({ months = [], values = [] }) {
  return months.map((month, i) => ({
    month,
    value: values[i] ?? 0,
  }));
}

export default function BarChart({ data, height = 380 }) {
  const { color } = data;
  const chartData = toChartData(data);

  return (
    <div className="w-full flex flex-col gap-4">
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
          barCategoryGap="30%"       // ← расстояние между столбцами
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

          {/* Y — скрыт, но нужен для масштаба */}
          <YAxis hide domain={[0, 'dataMax * 1.1']} />

          {/* Тултип при наведении */}
          <Tooltip
            cursor={{ fill: 'rgba(154, 136, 76, 0.08)' }}
            contentStyle={{
              backgroundColor: '#F3F2EC',
              border: '1px solid #94928B',
              borderRadius: 8,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 14,
            }}
            labelStyle={{ color: '#697077' }}
            formatter={(value) => [`${value} ₽`, 'Потрачено']}
            labelFormatter={(label) => `Месяц: ${label}`}
          />

          {/* Столбцы */}
          <Bar
            dataKey="value"
            fill={color}
            radius={[6, 6, 0, 0]}       // ← скругление верхних углов
            isAnimationActive={false}
            maxBarSize={40}             // ← максимальная ширина столбца
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={color} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}