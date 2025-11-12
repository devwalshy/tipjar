import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Distribution } from "@shared/schema";
import { formatCurrency, formatDate } from "@/utils/utils";
import { UsersIcon } from "lucide-react";

type HistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const { data: distributions, isLoading } = useQuery<Distribution[]>({
    queryKey: ["/api/distributions"],
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#3a5c5c] border border-[#4c6767] text-[#f5f5f5] sm:max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#f5f5f5]">
            Distribution History
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-grow scrollbar-hidden mt-4">
          <div className="space-y-4">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg bg-[#364949] animate-pulse"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-6 w-32 bg-[#4c6767] rounded" />

                      <div className="h-6 w-20 bg-[#4c6767] rounded" />
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-48 bg-[#4c6767] rounded" />
                    </div>
                  </div>
                ))
            ) : distributions && distributions.length > 0 ? (
              distributions.map((dist) => (
                <div
                  key={dist.id}
                  className="bg-[#364949] rounded-lg p-4 border border-[#4c6767] hover:border-[#93ec93] transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-[#f5f5f5]">
                      {formatDate(dist.date)}
                    </h3>
                    <span className="bg-[rgba(147,236,147,0.2)] text-[#93ec93] px-2 py-1 rounded-md text-xs">
                      {formatCurrency(dist.totalAmount)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-[#bfbfbf]">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    <span>
                      {Array.isArray(dist.partnerData)
                        ? dist.partnerData.length
                        : dist.partnerData &&
                            typeof dist.partnerData === "object"
                          ? Object.keys(
                              dist.partnerData as Record<string, unknown>,
                            ).length
                          : 0}{" "}
                      partners
                    </span>
                    <span className="mx-2">•</span>
                    <span>{dist.totalHours} total hours</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#364949] rounded-lg p-6 text-center">
                <p className="text-[#bfbfbf]">No distribution history yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#4c6767] flex justify-end">
          <button className="btn btn-transparent" onClick={onClose}>
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
