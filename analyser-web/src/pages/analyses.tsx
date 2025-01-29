import { useState, useEffect } from "react";
import { AnalysisCard } from "@/components/analysis-card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { UploadModal } from "@/components/upload-modal";
import { RestClient } from "@/lib/rest-client";
import { Analysis } from "@/models/analysis";

const apiClient = new RestClient();

export function AnalysesPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchTransactions = async () => {
    const analyses = await apiClient.get<Analysis[]>("/analyse");
    setAnalyses(analyses);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleUploadComplete = () => {
    fetchTransactions();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analyses</h1>
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload CSV
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {analyses.map((analysis) => (
          <AnalysisCard key={analysis.id} analysis={analysis} />
        ))}
      </div>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
