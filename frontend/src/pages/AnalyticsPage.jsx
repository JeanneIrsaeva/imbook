import { useEffect, useState } from 'react';
import AnalyticsHeader from '@components/analytics/AnalyticsHeader';
import StatsRow from '@components/analytics/StatsRow';
import DashboardCard from '@components/analytics/DashboardCard';
import DonutChart from '@components/analytics/DonutChart';
import LegendList from '@components/analytics/LegendList';
import BarChart from '@components/analytics/BarChart';
import LineChart from '@components/analytics/LineChart';
import apiClient from '../api/client';
import { toast } from 'sonner';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get('/analytics');
        setData(res.data);
      } catch {
        toast.error('Не удалось загрузить аналитику');
      }
    };
    load();
  }, []);

  if (!data) return <div className="p-20 text-center text-muted">Загрузка...</div>;

  const statsCards = [
    { id: 'total', label: 'Всего книг', value: String(data.stats.total_books) },
    { id: 'read', label: 'Прочитано книг', value: String(data.stats.read_books) },
    { id: 'pages', label: 'Прочитано страниц', value: String(data.stats.total_pages_read) },
    { id: 'price', label: 'Стоимость библиотеки', value: `${(data.stats.library_value / 100).toFixed(0)} ₽` },
  ];

  return (
    <div className="max-w-[1700px] mx-auto px-4 md:px-10 pt-8 md:pt-[50px] pb-8 md:pb-12">
      <AnalyticsHeader />
      <StatsRow items={statsCards} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 md:mt-12">
        <DashboardCard title="Распределение по статусам">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <DonutChart data={data.by_status} />
            <LegendList items={data.by_status} />
          </div>
        </DashboardCard>
        <DashboardCard title="Распределение по жанрам">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <DonutChart data={data.by_genre} />
            <LegendList items={data.by_genre} />
          </div>
        </DashboardCard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <DashboardCard title="Прочитанные книги по месяцам">
          <LineChart data={{ months: data.books_by_month.map((x) => x.month), values: data.books_by_month.map((x) => x.value), color: '#75391D' }} />
        </DashboardCard>
        <DashboardCard title="Потрачено денег по месяцам">
          <BarChart data={{ months: data.spending_by_month.map((x) => x.month), values: data.spending_by_month.map((x) => x.value), color: '#A26745' }} />
        </DashboardCard>
      </div>
    </div>
  );
}