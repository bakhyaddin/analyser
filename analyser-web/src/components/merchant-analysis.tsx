import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Merchant } from "@/models/merchant";

interface MerchantAnalysisProps {
  merchants: Merchant[];
}

export function MerchantAnalysis({ merchants = [] }: MerchantAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Normalized Merchants</CardTitle>
        <CardDescription>
          AI-powered merchant name normalization and categorization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {merchants.map((merchant, index) => (
          <div
            key={`${merchant.originalName}_${index}`}
            className="flex items-start justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
          >
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Original</p>
              <p className="font-mono">{merchant.originalName}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="destructive">{merchant.category}</Badge>
                <Badge variant="destructive">{merchant.subCategory}</Badge>
                {merchant.flags.map((flag) => (
                  <Badge key={flag} variant="secondary">
                    {flag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Normalized</p>
              <p className="font-semibold">{merchant.name}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
