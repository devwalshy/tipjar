import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Distribution } from "@shared/schema";
import { formatCurrency, formatDate } from "@/lib/utils";
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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      data-oid="17kpfqw"
    >
      <DialogContent
        className="bg-[#3a5c5c] border border-[#4c6767] text-[#f5f5f5] sm:max-w-3xl max-h-[80vh] overflow-hidden flex flex-col"
        data-oid="1wha7jk"
      >
        <DialogHeader data-oid="3e8ra74">
          <DialogTitle
            className="text-xl font-bold text-[#f5f5f5]"
            data-oid="13y_ewj"
          >
            Distribution History
          </DialogTitle>
        </DialogHeader>

        <div
          className="overflow-y-auto flex-grow scrollbar-hidden mt-4"
          data-oid="lcvq6z_"
        >
          <div className="space-y-4" data-oid="x4:6kam">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg bg-[#364949] animate-pulse"
                    data-oid="88kitgr"
                  >
                    <div
                      className="flex justify-between items-center mb-2"
                      data-oid="g.u.kf_"
                    >
                      <div
                        className="h-6 w-32 bg-[#4c6767] rounded"
                        data-oid="wxiku7_"
                      />

                      <div
                        className="h-6 w-20 bg-[#4c6767] rounded"
                        data-oid="3v1hq2f"
                      />
                    </div>
                    <div className="flex items-center" data-oid="yic5:1z">
                      <div
                        className="h-4 w-48 bg-[#4c6767] rounded"
                        data-oid="a5jykqu"
                      />
                    </div>
                  </div>
                ))
            ) : distributions && distributions.length > 0 ? (
              distributions.map((dist) => (
                <div
                  key={dist.id}
                  className="bg-[#364949] rounded-lg p-4 border border-[#4c6767] hover:border-[#93ec93] transition-colors cursor-pointer"
                  data-oid="y6_cvam"
                >
                  <div
                    className="flex justify-between items-center mb-2"
                    data-oid="4lt5c1_"
                  >
                    <h3
                      className="font-semibold text-[#f5f5f5]"
                      data-oid="wjjejxc"
                    >
                      {formatDate(dist.date)}
                    </h3>
                    <span
                      className="bg-[rgba(147,236,147,0.2)] text-[#93ec93] px-2 py-1 rounded-md text-xs"
                      data-oid="4udm9q3"
                    >
                      {formatCurrency(dist.totalAmount)}
                    </span>
                  </div>
                  <div
                    className="flex items-center text-sm text-[#bfbfbf]"
                    data-oid="9q:nhu6"
                  >
                    <UsersIcon className="h-4 w-4 mr-2" data-oid=":d2dlha" />
                    <span data-oid="vuss6ud">
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
                    <span className="mx-2" data-oid="ctt:8e-">
                      •
                    </span>
                    <span data-oid="xdje78b">
                      {dist.totalHours} total hours
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="bg-[#364949] rounded-lg p-6 text-center"
                data-oid="t-jpal_"
              >
                <p className="text-[#bfbfbf]" data-oid="xy5toej">
                  No distribution history yet
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          className="mt-4 pt-4 border-t border-[#4c6767] flex justify-end"
          data-oid="sw1w1ae"
        >
          <button
            className="btn btn-transparent"
            onClick={onClose}
            data-oid="6axb6:f"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
