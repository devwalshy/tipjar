import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useTipContext } from "@/context/TipContext";
import { parseManualEntry } from "@/lib/utils";

type ManualEntryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ManualEntryModal({
  isOpen,
  onClose,
}: ManualEntryModalProps) {
  const [manualInput, setManualInput] = useState("");
  const { toast } = useToast();
  const { setPartnerHours, setExtractedText } = useTipContext();

  const handleSave = () => {
    if (!manualInput.trim()) {
      toast({
        title: "No data entered",
        description: "Please enter partner information",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsedData = parseManualEntry(manualInput);

      if (parsedData.length === 0) {
        toast({
          title: "Invalid format",
          description: "Please use the format: Name: hours",
          variant: "destructive",
        });
        return;
      }

      setPartnerHours(parsedData);
      setExtractedText(manualInput);

      toast({
        title: "Partners saved",
        description: `${parsedData.length} partners have been added`,
      });

      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error parsing data",
        description: "Please check your input format",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      data-oid="aeyb0q2"
    >
      <DialogContent
        className="sm:max-w-2xl bg-[#3a5c5c] border border-[#4c6767] text-[#f5f5f5]"
        data-oid="6-q4k9c"
      >
        <DialogHeader data-oid="gt6cl9l">
          <DialogTitle
            className="text-xl font-bold text-[#f5f5f5]"
            data-oid="u2a9.2v"
          >
            Manual Partner Entry
          </DialogTitle>
          <DialogDescription className="text-[#bfbfbf]" data-oid="3h1iuyu">
            Enter partner names and hours, one per line in the format:
            <span
              className="font-mono bg-[#364949] px-2 py-1 rounded ml-2 text-[#f5f5f5]"
              data-oid="d-4loi7"
            >
              Name: hours
            </span>
          </DialogDescription>
        </DialogHeader>

        <textarea
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          className="h-64 bg-[#364949] border border-[#4c6767] font-mono resize-none w-full rounded-md text-[#f5f5f5] p-3"
          placeholder="John Smith: 32
Maria Garcia: 24
David Johnson: 40"
          data-oid="b8ubvmn"
        />

        <DialogFooter data-oid="n4iph3k">
          <button
            className="btn btn-transparent mr-2"
            onClick={onClose}
            data-oid="6ck6feb"
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            data-oid="v47z6tf"
          >
            Save Partners
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
