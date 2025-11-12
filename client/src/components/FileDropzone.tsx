import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTipContext } from "@/context/TipContext";
import {
  UploadCloudIcon,
  Loader2Icon,
  CheckCircleIcon,
  XCircleIcon,
  FileTextIcon,
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setState(DropzoneState.DRAGGING);
  };

  const handleDragLeave = () => {
    setState(DropzoneState.IDLE);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files?.length) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select a report image file",
        variant: "destructive",
      });
      return;
    }

    setState(DropzoneState.PROCESSING);
    setFileName(file.name);
    setErrorMessage(null);

    try {
      // Send the image to the server for OCR processing
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
        // Extract specific error message from the server response or fall back to a generic message
        const errorMsg =
          parsedError ||
          `OCR request failed with status ${response.status} ${response.statusText}`;
        setErrorMessage(errorMsg);
        throw new Error(errorMsg);
      }

      // Always set the extracted text if available to show everything OCR found
      if (result.extractedText) {
        setExtractedText(result.extractedText);
      }

      if (result.partnerHours && result.partnerHours.length > 0) {
        setPartnerHours(result.partnerHours);
        setState(DropzoneState.SUCCESS);

        setTimeout(() => {
          setState(DropzoneState.IDLE);
        }, 3000);

        toast({
          title: "Report processed",
          description: `Successfully extracted ${result.partnerHours.length} partners`,
        });
      } else {
        // No partners found in the report
        setErrorMessage(
          "No partner information detected in the report. Please try a different file.",
        );
        setState(DropzoneState.ERROR);

        toast({
          title: "Processing issue",
          description: "OCR detected text but couldn't identify partner hours.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error(error);

      const messageFromError =
        error instanceof Error && error.message ? error.message : null;

      const errorMsg =
        messageFromError ||
        errorMessage ||
        "Failed to extract partner information from the report";

      setErrorMessage(errorMsg);
      setState(DropzoneState.ERROR);

      toast({
        title: "Processing failed",
        description: errorMsg,
        variant: "destructive",
      });

      setTimeout(() => {
        setState(DropzoneState.IDLE);
      }, 5000);
    }
  };

  const renderDropzoneContent = () => {
    switch (state) {
      case DropzoneState.DRAGGING:
        return (
          <>
            <div
              className="mb-4 h-16 w-16 text-[#93ec93] mx-auto animate-pulse"
              data-oid="l18rdzs"
            >
              <div
                className="h-full w-full rounded-full bg-[#364949] p-3 shadow-[0_0_15px_rgba(147,236,147,0.4)]"
                data-oid="1c:ta-h"
              >
                <UploadCloudIcon className="h-full w-full" data-oid="x9ac333" />
              </div>
            </div>
            <p
              className="text-[#f5f5f5] m-0 mb-2 text-sm sm:text-base font-medium"
              data-oid="6_oalmy"
            >
              Release to upload
            </p>
          </>
        );

      case DropzoneState.PROCESSING:
        return (
          <>
            <div
              className="mb-4 h-16 w-16 text-[#9fd6e9] mx-auto"
              data-oid="otd31ll"
            >
              <div
                className="h-full w-full rounded-full bg-[#364949] p-3 shadow-[0_0_15px_rgba(159,214,233,0.4)]"
                data-oid="hlusqqg"
              >
                <Loader2Icon
                  className="h-full w-full animate-spin"
                  data-oid="tqlora-"
                />
              </div>
            </div>
            <p
              className="text-[#f5f5f5] m-0 mb-2 text-sm sm:text-base font-medium"
              data-oid="m5jx-q4"
            >
              Processing report...
            </p>
            <div
              className="w-48 h-2 bg-[#364949] rounded-full overflow-hidden mt-2"
              data-oid="j73m:vu"
            >
              <div
                className="h-full bg-[#9fd6e9] shimmer"
                data-oid="q9vgw-f"
              ></div>
            </div>
          </>
        );

      case DropzoneState.SUCCESS:
        return (
          <div className="animate-scaleIn" data-oid="-cr8_ci">
            <div
              className="mb-4 h-16 w-16 text-[#93ec93] mx-auto"
              data-oid="-k3reaz"
            >
              <div
                className="h-full w-full rounded-full bg-[#364949] p-3 shadow-[0_0_15px_rgba(147,236,147,0.5)]"
                data-oid="gdt_bpx"
              >
                <CheckCircleIcon className="h-full w-full" data-oid="zhet0pb" />
              </div>
            </div>
            <p
              className="text-[#f5f5f5] m-0 mb-2 text-sm sm:text-base font-medium"
              data-oid="qnvd4t1"
            >
              File processed successfully!
            </p>
            {fileName && (
              <div
                className="flex items-center justify-center bg-[#364949] rounded-full px-4 py-2 mx-auto max-w-max"
                data-oid="9n.fwkl"
              >
                <FileTextIcon
                  className="h-4 w-4 text-[#ffeed6] mr-2"
                  data-oid="2usmzb_"
                />

                <p
                  className="text-xs sm:text-sm text-[#ffeed6] m-0 truncate max-w-[180px]"
                  data-oid="p1wfyzk"
                >
                  {fileName}
                </p>
              </div>
            )}
          </div>
        );

      case DropzoneState.ERROR:
        return (
          <div className="animate-scaleIn" data-oid="f4xz2q8">
            <div
              className="mb-4 h-16 w-16 text-red-500 mx-auto"
              data-oid="bac52u:"
            >
              <div
                className="h-full w-full rounded-full bg-[#364949] p-3 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                data-oid="09c4_i8"
              >
                <XCircleIcon className="h-full w-full" data-oid="3fmp30:" />
              </div>
            </div>
            <p
              className="text-[#f5f5f5] m-0 mb-2 text-sm sm:text-base font-medium"
              data-oid="c:jacyf"
            >
              Processing failed
            </p>
            <div
              className="bg-[#364949] rounded-lg p-3 mb-3 max-w-[280px] mx-auto"
              data-oid="y9hwn7e"
            >
              <p
                className="text-xs sm:text-sm text-[#ffeed6] m-0"
                data-oid="av0vt23"
              >
                {errorMessage || "Please try again with a different report"}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setState(DropzoneState.IDLE);
              }}
              className="text-sm font-medium text-[#364949] bg-[#93ec93] hover:bg-opacity-90 inline-flex h-10 justify-center items-center whitespace-nowrap border-0 rounded-full px-6 py-2 transition-all duration-300 shadow-md hover:shadow-lg"
              data-oid=":4z6c::"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                data-oid="qmd1dsz"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  data-oid="jukghd."
                />
              </svg>
              Try Again
            </button>
          </div>
        );

      default:
        return (
          <div className="animate-fadeIn w-full" data-oid="qwc2npe">
            <div className="flex flex-col items-center" data-oid="yc6:sko">
              <div
                className="mb-4 h-16 w-16 text-[#93ec93] mx-auto"
                data-oid="xn45:28"
              >
                <div
                  className="h-full w-full rounded-full bg-[#364949] p-3 group-hover:shadow-[0_0_25px_rgba(147,236,147,0.4)] transition-all duration-300"
                  data-oid="y.t_y9r"
                >
                  <UploadCloudIcon
                    className="h-full w-full"
                    data-oid="3:4ebip"
                  />
                </div>
              </div>
              <p
                className="text-[#ffeed6] m-0 mb-4 text-sm opacity-80"
                data-oid="s90w.v4"
              >
                Upload your partner hours report
              </p>
              <button
                className="text-sm font-medium text-[#364949] bg-[#93ec93] hover:bg-opacity-90 inline-flex h-10 sm:h-12 justify-center items-center whitespace-nowrap border-0 rounded-full px-6 sm:px-8 py-2 sm:py-3 transition-all duration-300 shadow-md hover:shadow-lg group file-dropzone-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                data-oid="bblbv1h"
              >
                <UploadCloudIcon
                  className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                  data-oid="io2ldhc"
                />

                <span className="font-medium" data-oid="-_ghwu2">
                  Upload Report
                </span>
              </button>
            </div>
            <div
              className="text-xs text-[#9fd6e9] mt-4 opacity-70"
              data-oid="8.7fjct"
            >
              Supported formats: PNG, JPG, JPEG, GIF
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div
        className="gradient-border mb-4 sm:mb-6 bg-[#3a5c5c] text-center rounded-lg p-4 sm:p-6 flex justify-center items-center min-h-[200px] sm:min-h-[220px] shadow-soft"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-oid="hgrh5bo"
      >
        {renderDropzoneContent()}
      </div>
      <input
        type="file"
        id="fileInput"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileInputChange}
        data-oid="6h0ijqn"
      />
    </>
  );
}
