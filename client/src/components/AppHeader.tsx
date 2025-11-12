import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import HistoryModal from "@/components/HistoryModal";

export default function AppHeader() {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [location] = useLocation();

  return (
    <header
      className="bg-[#1E3535] shadow-soft animate-fadeIn"
      data-oid="xmg1hq1"
    >
      <div
        className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center"
        data-oid="3:ljbz0"
      >
        <Link href="/" data-oid=".jxvbjm">
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            data-oid="7y1umb-"
          >
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 bg-[#93EC93] rounded-full flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(147,236,147,0.5)]"
              data-oid="d.9dgp5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 text-[#364949] group-hover:scale-110 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                data-oid="-_i7.w-"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  data-oid="jqh_xga"
                />
              </svg>
            </div>
            <div className="transition-all" data-oid="vzugh1b">
              <h1
                className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#93EC93] transition-colors duration-300"
                data-oid="e6:65bk"
              >
                TipJar
              </h1>
              <div
                className="hidden sm:block text-xs text-[#9fd6e9] opacity-80"
                data-oid="w0_arra"
              >
                Smart Tip Distribution
              </div>
              <div
                className="h-0.5 bg-[#93EC93] w-0 group-hover:w-full transition-all duration-500"
                data-oid="t1r2k1l"
              ></div>
            </div>
          </div>
        </Link>

        <div className="flex items-center" data-oid="y76m9tz">
          <Button
            variant="outline"
            className="p-1 sm:p-2 rounded-full bg-[#364949] hover:bg-[#93EC93] hover:text-[#364949] transition-all duration-300 border-none"
            size="icon"
            data-oid="914_ek:"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              data-oid="hq17rlq"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                data-oid="2k.bxkh"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                data-oid="zqhvr:q"
              />
            </svg>
          </Button>
        </div>
      </div>

      {showHistoryModal && (
        <HistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          data-oid="buqtm-n"
        />
      )}
    </header>
  );
}
