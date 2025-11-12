import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FileDropzone from "@/components/FileDropzone";
import ResultsSummaryCard from "@/components/ResultsSummaryCard";
import PartnerPayoutsList from "@/components/PartnerPayoutsList";
import { useTipContext } from "@/context/TipContext";
import { apiRequest } from "@/lib/queryClient";
import { calculateHourlyRate } from "@/lib/utils";

export default function Home() {
  const [tipAmount, setTipAmount] = useState<number | "">("");
  const [isCalculating, setIsCalculating] = useState(false);

  const { toast } = useToast();
  const { partnerHours, distributionData, setDistributionData } =
    useTipContext();

  const handleCalculate = async () => {
    if (!partnerHours.length) {
      toast({
        title: "No partner data",
        description: "Please upload a report with partner information",
        variant: "destructive",
      });
      return;
    }

    if (!tipAmount) {
      toast({
        title: "Missing tip amount",
        description: "Please enter the total tip amount",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);

    try {
      const totalHours = partnerHours.reduce(
        (sum, partner) => sum + partner.hours,
        0,
      );
      const hourlyRate = calculateHourlyRate(Number(tipAmount), totalHours);

      const res = await apiRequest("POST", "/api/distributions/calculate", {
        partnerHours,
        totalAmount: Number(tipAmount),
        totalHours,
        hourlyRate,
      });

      const calculatedData = await res.json();
      setDistributionData(calculatedData);

      toast({
        title: "Distribution calculated",
        description: "Tip distribution calculated successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Calculation failed",
        description: "An error occurred while calculating the distribution",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <main
      className="px-2 sm:px-4 max-w-full overflow-hidden"
      data-oid="ia1-g3y"
    >
      <div
        className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        data-oid="pdkh0qc"
      >
        {/* Left Column - Input Section */}
        <div className="md:col-span-1" data-oid="lviatdn">
          <div className="card animate-fadeIn shadow-soft" data-oid="0kjdkvx">
            <div className="card-header" data-oid="ip6f._5">
              <div className="flex items-center" data-oid="51oy.k.">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-[#93EC93]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  data-oid=":7wlhg4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    data-oid="kifwual"
                  />
                </svg>
                <div
                  className="text-lg font-semibold tracking-tight text-[#f5f5f5]"
                  data-oid="nuyq4qt"
                >
                  TipJar
                </div>
              </div>
            </div>
            <div className="card-body" data-oid="2zbgbp7">
              <FileDropzone data-oid="xn-f4pi" />

              <div className="mb-4 sm:mb-6 mt-4" data-oid="wht2ggu">
                <label
                  htmlFor="tipAmount"
                  className="flex items-center text-sm font-medium text-[#ffeed6] mb-2"
                  data-oid="_zenht5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-[#93EC93]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    data-oid="d6d3pc_"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      data-oid="dzwvm:l"
                    />
                  </svg>
                  Total Tip Amount
                </label>
                <div className="relative" data-oid="p4u6u_1">
                  <div
                    className="pointer-events-none absolute top-0 bottom-0 left-0 flex items-center pl-4"
                    data-oid="cpl6qm7"
                  >
                    <span
                      className="text-[#9fd6e9] font-medium"
                      data-oid="inubfs-"
                    >
                      $
                    </span>
                  </div>
                  <input
                    id="tipAmount"
                    type="number"
                    value={tipAmount}
                    onChange={(e) =>
                      setTipAmount(e.target.value ? Number(e.target.value) : "")
                    }
                    className="h-12 w-full bg-[#364949] text-[#f5f5f5] border-[1.11111px] border-[#415858] rounded-md py-2 px-3 pl-8 focus:outline-none focus:ring-2 focus:ring-[#93ec93] focus:border-transparent transition-all"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    data-oid="-8-aumm"
                  />
                </div>
              </div>

              <button
                onClick={handleCalculate}
                className="text-[#364949] bg-[#93ec93] hover:bg-opacity-90 transition-all duration-300 inline-flex h-12 w-full justify-center items-center gap-2 whitespace-nowrap font-medium rounded-md px-4 py-3 shadow-md hover:shadow-lg file-dropzone-btn"
                disabled={isCalculating}
                data-oid="0:7lxm2"
              >
                {isCalculating ? (
                  <div
                    className="flex items-center justify-center"
                    data-oid="ld65fgn"
                  >
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#364949]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      data-oid="g94xd74"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        data-oid="kx0.j3x"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        data-oid="39ihj5e"
                      ></path>
                    </svg>
                    Calculating...
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center"
                    data-oid="mqasota"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      data-oid="gv252rz"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        data-oid="nw90q19"
                      />
                    </svg>
                    Calculate Distribution
                  </div>
                )}
              </button>

              <div
                className="mt-3 text-center text-[#f5f5f5]"
                data-oid="e4--:fn"
              >
                <div className="font-medium" data-oid="jym27cz">
                  Made by William Walsh
                </div>
                <div className="text-xs text-[#9fd6e9]" data-oid="zg8z4yb">
                  Starbucks Store# 66900
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-only results instruction */}
          {distributionData && (
            <div
              className="block md:hidden mt-4 p-3 rounded-md bg-[#364949] text-[#ffeed6] text-sm text-center animate-fadeIn"
              data-oid="vgaryrv"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mx-auto mb-1 text-[#93EC93]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                data-oid="_hyujf:"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
                  data-oid="7zojzm4"
                />
              </svg>
              Scroll down to see your distribution results
            </div>
          )}
        </div>

        {/* Middle/Right Column - Results Section */}
        <div className="md:col-span-2" data-oid="5rpr2tf">
          {distributionData && (
            <div className="results-container" data-oid="7t5nnxo">
              <ResultsSummaryCard
                totalHours={distributionData.totalHours}
                hourlyRate={distributionData.hourlyRate}
                totalAmount={distributionData.totalAmount}
                data-oid="jrumg8x"
              />

              <PartnerPayoutsList
                distributionData={distributionData}
                data-oid="_3kj3oa"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
