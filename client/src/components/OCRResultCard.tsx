import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTipContext } from "@/context/TipContext";
import { DownloadIcon } from "lucide-react";

export default function OCRResultCard() {
  const { extractedText } = useTipContext();
  const { toast } = useToast();

  const handleDownload = () => {
    if (!extractedText) {
      toast({
        title: "No data to download",
        description: "Please process a schedule first",
        variant: "destructive",
      });
      return;
    }

    // Create a download link for the extracted text
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tipjar-extracted-data-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: "Extracted data is being downloaded",
    });
  };

  // We're not displaying the OCR card anymore as requested
  // but keep the component for its functionality
  return null;
}
