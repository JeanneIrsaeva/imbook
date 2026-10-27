// src/pages/AnalyticsPage.jsx
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import StatsRow from '@/components/analytics/StatsRow';
import DashboardCard from '@/components/analytics/DashboardCard';
import DonutChart from '@/components/analytics/DonutChart';
import LegendList from '@/components/analytics/LegendList';
import BarChart from '@/components/analytics/BarChart';
import LineChart from '@/components/analytics/LineChart';
import {
  mockStatsCards,
  mockStatusDistribution,
  mockGenreDistribution,
  mockBooksByMonth,
  mockSpendingByMonth,
} from '@/mocks/analytics';

export default function AnalyticsPage() {
  return (
    <div className="max-w-[1700px] mx-auto px-10 pt-[50px] pb-12">
      {/* pt-[50px] — отступ сверху от шапки */}
      <AnalyticsHeader />

      <StatsRow items={mockStatsCards} />

      {/* Диаграммы по кругу */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
        <DashboardCard title="Распределение по статусам">
          <div className="flex items-center gap-6">
            <DonutChart data={mockStatusDistribution} />
            <LegendList items={mockStatusDistribution} />
          </div>
        </DashboardCard>

        <DashboardCard title="Распределение по жанрам">
          <div className="flex items-center gap-6">
            <DonutChart data={mockGenreDistribution} />
            <LegendList items={mockGenreDistribution} />
          </div>
        </DashboardCard>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <DashboardCard title="Прочитанные книги по месяцам">
          <LineChart data={mockBooksByMonth} />
        </DashboardCard>

        <DashboardCard title="Потрачено денег по месяцам">
          <BarChart data={mockSpendingByMonth} />
        </DashboardCard>
      </div>
    </div>
  );
}