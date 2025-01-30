import { useState } from "react";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";

// components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

// utils
import { RestClient } from "@/lib/rest-client";

// models
import { Upload as UploadModel } from "@/models/upload";
import { Analysis } from "@/models/analysis";

const apiClient = new RestClient();

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export function UploadModal({
  isOpen,
  onClose,
  onUploadComplete,
}: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError("Please select a valid CSV file.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);
    setSuccess(false);

    try {
      // generate s3 url
      const uploadResponse = await apiClient.post<UploadModel>("/upload", {});
      setUploadProgress(33);

      // upload file
      await fetch(uploadResponse.signedUrl, { method: "PUT", body: file });
      setUploadProgress(65);

      // create analysis data
      await apiClient.post<Analysis>("/analyse", {
        objectId: uploadResponse.objectKey,
      });

      setUploadProgress(100);
      setSuccess(true);
      setTimeout(() => {
        onUploadComplete();
        onClose();
      }, 500);
    } catch (err) {
      setError("An error occurred during the upload process.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload CSV File</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing transaction data.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="csv-file" className="text-right">
              CSV File
            </Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="col-span-3"
            />
          </div>
          {error && (
            <div className="flex items-center text-red-500">
              <AlertCircle className="mr-2 h-4 w-4" />
              {error}
            </div>
          )}
          {uploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-500">
                Uploading and processing... {uploadProgress}%
              </p>
            </div>
          )}
          {success && (
            <div className="flex items-center text-green-500">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Upload completed successfully!
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
