import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AnalysisMetrics } from "@/components/analysis-metrics";
import { PatternDetection } from "@/components/pattern-detection";
import { MerchantAnalysis } from "@/components/merchant-analysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RestClient } from "@/lib/rest-client";
import { Merchant } from "@/models/merchant";
import { Pattern } from "@/models/pattern";

const apiClient = new RestClient();

export function AnalysisDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalSpend: "0",
    transactionCount: 0,
    avarageSpend: "0",
    merchantCount: 0,
  });
  const [patternDetectionData, setPatternDetectionData] = useState<Pattern[]>(
    []
  );
  const [merchantAnalysisData, setMerchantAnalysisData] = useState<Merchant[]>(
    []
  );

  useEffect(() => {
    const fetchTransactionDetails = async (id: string) => {
      try {
        setLoading(true);

        const [patternDetectionData, merchandAnalysisData] = await Promise.all([
          apiClient.post<Pattern[]>("/analyse/patterns", { analysisId: id }),
          apiClient.post<Merchant[]>("/analyse/merchant", { analysisId: id }),
        ]);
        const totalSpend = patternDetectionData.reduce((acc, current) => {
          acc += parseFloat(current.amount);
          return acc;
        }, 0);

        setPatternDetectionData(patternDetectionData);
        setMerchantAnalysisData(merchandAnalysisData);
        setMetrics({
          totalSpend: totalSpend.toFixed(2),
          transactionCount: patternDetectionData.length,
          avarageSpend: (totalSpend / patternDetectionData.length).toFixed(2),
          merchantCount: merchandAnalysisData.length,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analysis details:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchTransactionDetails(id);
    }
  }, [id]);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 space-y-4">
        <Button variant="ghost" className="mb-4" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Analyses
        </Button>
        <h1 className="text-2xl font-bold">Analysis Details</h1>
        <p className="text-muted-foreground">Analysis ID: {id}</p>
      </div>

      <div className="space-y-6">
        <AnalysisMetrics {...metrics} />
        {loading ? (
          <div className="container mx-auto p-6">Loading...</div>
        ) : (
          <Tabs defaultValue="patterns">
            <TabsList>
              <TabsTrigger value="patterns">Pattern Detection</TabsTrigger>
              <TabsTrigger value="merchants">Merchant Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="patterns" className="mt-6">
              <PatternDetection patterns={patternDetectionData} />
            </TabsContent>
            <TabsContent value="merchants" className="mt-6">
              <MerchantAnalysis merchants={merchantAnalysisData} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
