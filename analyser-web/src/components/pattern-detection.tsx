import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pattern } from '@/models/pattern';

interface PatternDetectionProps {
  patterns: Pattern[];
}

export function PatternDetection({ patterns = [] }: PatternDetectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detected Patterns</CardTitle>
        <CardDescription>
          Subscription and recurring payment detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {patterns.map((pattern, index) => (
          <div
            key={`${pattern.merchant}_${index}`}
            className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
          >
            <div className="space-y-1">
              <h3 className="font-semibold">{pattern.merchant}</h3>
              <p className="text-sm text-gray-500">
                {pattern.type} • {pattern.frequency}
              </p>
              <p className="text-sm text-gray-500">{pattern.notes}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{pattern.amount}</p>
              {pattern.nextExpected && (
                <p className="text-sm text-gray-500">
                  Next: {pattern.nextExpected}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
