import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTipContext } from "@/context/TipContext";
import {
  UploadCloud,
  Loader2,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";

enum DropzoneState {
  IDLE = "idle",
  DRAGGING = "dragging",
  PROCESSING = "processing",
  SUCCESS = "success",
  ERROR = "error",
}

export default function FileDropzone() {
  const [state, setState] = useState<DropzoneState>(DropzoneState.IDLE);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { setPartnerHours, setExtractedText } = useTipContext();

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setState(DropzoneState.DRAGGING);
  };

  const handleDragLeave = () => {
    setState(DropzoneState.IDLE);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.dataTransfer.files.length) {
      await processFile(event.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files?.length) {
      await processFile(event.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Unsupported file",
        description: "Please upload an image capture of the partner hours report.",
        variant: "destructive",
      });
      return;
    }

    setState(DropzoneState.PROCESSING);
    setFileName(file.name);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      const clonedResponse = response.clone();
      let result: any = null;
      let rawResponseBody: string | null = null;

      try {
        result = await response.json();
      } catch {
        try {
          rawResponseBody = await clonedResponse.text();
        } catch {
          rawResponseBody = null;
        }
      }

      const trimmedRawResponse =
        typeof rawResponseBody === "string" ? rawResponseBody.trim() : null;

      const parsedError =
        (result && (result.error || result.message)) ||
        (trimmedRawResponse && trimmedRawResponse.length > 0
          ? `Unexpected response from server: ${trimmedRawResponse.slice(0, 200)}${
              trimmedRawResponse.length > 200 ? "…" : ""
            }`
          : null);

      if (
        !response.ok ||
        result === null ||
        (typeof result !== "object" && typeof result !== "function")
      ) {
        const errorMsg =
          parsedError ||
          `OCR request failed with status ${response.status} ${response.statusText}`;
        setErrorMessage(errorMsg);
        throw new Error(errorMsg);
      }

      if (result.extractedText) {
        setExtractedText(result.extractedText);
      }

      if (result.partnerHours && result.partnerHours.length > 0) {
        setPartnerHours(result.partnerHours);
        setState(DropzoneState.SUCCESS);

        setTimeout(() => {
          setState(DropzoneState.IDLE);
        }, 2500);

        toast({
          title: "Report synced",
          description: `Captured ${result.partnerHours.length} partners from this upload.`,
        });
      } else {
        const fallbackMessage =
          "We read the file but could not identify partner hours. Try a sharper photo.";
        setErrorMessage(fallbackMessage);
        setState(DropzoneState.ERROR);

        toast({
          title: "No partner data",
          description: fallbackMessage,
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      console.error(error);
      const messageFromError =
        error instanceof Error && error.message ? error.message : null;
      const errorMsg =
        messageFromError ||
        errorMessage ||
        "Failed to extract partner information. Please retry.";

      setErrorMessage(errorMsg);
      setState(DropzoneState.ERROR);

      toast({
        title: "Processing failed",
        description: errorMsg,
        variant: "destructive",
      });

      setTimeout(() => {
        setState(DropzoneState.IDLE);
      }, 4000);
    }
  };

  const renderStateIcon = () => {
    switch (state) {
      case DropzoneState.DRAGGING:
        return <UploadCloud className="h-6 w-6 text-brand-forest" />;
      case DropzoneState.PROCESSING:
        return <Loader2 className="h-6 w-6 animate-spin text-brand-pine" />;
      case DropzoneState.SUCCESS:
        return <CheckCircle2 className="h-6 w-6 text-brand-forest" />;
      case DropzoneState.ERROR:
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <FileText className="h-6 w-6 text-brand-pine" />;
    }
  };

  const stateLabel = {
    [DropzoneState.IDLE]: "Drop your report here",
    [DropzoneState.DRAGGING]: "Release to upload",
    [DropzoneState.PROCESSING]: "Scanning report…",
    [DropzoneState.SUCCESS]: "Hours captured",
    [DropzoneState.ERROR]: "Try another photo",
  }[state];

  return (
    <div className="space-y-3">
      <div
        className={`group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/80 bg-surface-subtle/70 px-5 py-8 text-center transition-all duration-300 ${
          state === DropzoneState.DRAGGING
            ? "border-brand-forest bg-brand-sky/40"
            : state === DropzoneState.PROCESSING
              ? "border-brand-pine bg-brand-pine/10"
              : state === DropzoneState.SUCCESS
                ? "border-brand-forest/80 bg-brand-forest/5"
                : state === DropzoneState.ERROR
                  ? "border-red-400/80 bg-red-400/10"
                  : "hover:border-brand-pine hover:bg-brand-sky/30"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-forest/10">
          {renderStateIcon()}
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-semibold text-text-default">{stateLabel}</p>
          <p className="text-xs text-text-muted">
            JPEG or PNG screenshots from the Partner Hub export work best.
          </p>
        </div>
        <div className="rounded-full bg-brand-forest/10 px-4 py-1 text-xs font-semibold text-brand-forest">
          Browse files
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
      {fileName && (
        <p className="text-xs text-text-muted">
          Last uploaded: <span className="font-medium text-text-default">{fileName}</span>
        </p>
      )}
      {errorMessage && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
