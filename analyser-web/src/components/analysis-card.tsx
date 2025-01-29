import { Card, CardContent } from '@/components/ui/card';
import { Analysis } from '@/models/analysis';
import { useNavigate } from 'react-router-dom';

interface AnalysisCardProps {
  analysis: Analysis;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/analysis/${analysis.id}`)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <p className="text-m">
              <strong>Analysis ID:</strong> {analysis.id}
            </p>
            <p className="text-xs">
              {new Date(analysis.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
