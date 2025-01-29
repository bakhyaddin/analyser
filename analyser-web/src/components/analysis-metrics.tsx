import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, CreditCard, BarChart, Store } from 'lucide-react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

interface AnalysisMetricsProps {
  totalSpend: string;
  transactionCount: number;
  avarageSpend: string;
  merchantCount: number;
}

function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="text-gray-500">{icon}</div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalysisMetrics({
  totalSpend,
  transactionCount,
  avarageSpend,
  merchantCount,
}: AnalysisMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard
        icon={<DollarSign className="h-5 w-5" />}
        label="Total Spend"
        value={totalSpend}
      />
      <MetricCard
        icon={<CreditCard className="h-5 w-5" />}
        label="Transactions"
        value={transactionCount}
      />
      <MetricCard
        icon={<BarChart className="h-5 w-5" />}
        label="Avg. Transaction"
        value={avarageSpend}
      />
      <MetricCard
        icon={<Store className="h-5 w-5" />}
        label="Merchants"
        value={merchantCount}
      />
    </div>
  );
}
