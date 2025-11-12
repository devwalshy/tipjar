import { PartnerPayout } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

type PartnerCardProps = {
  partner: PartnerPayout;
  hourlyRate: number;
};

// Get a CSS class based on denomination
const getBillClass = (denomination: number): string => {
  switch (denomination) {
    case 20:
      return "bg-[#d2b0e3] text-[#364949]"; // Purple for $20
    case 10:
      return "bg-[#dd7895] text-[#364949]"; // Pink for $10
    case 5:
      return "bg-[#ffd1ba] text-[#364949]"; // Orange for $5
    case 1:
      return "bg-[#ffeed6] text-[#364949]"; // Yellow for $1
    default:
      return "bg-[#93ec93] text-[#364949]"; // Green fallback
  }
};

export default function PartnerCard({ partner, hourlyRate }: PartnerCardProps) {
  return (
    <div
      className="card animate-fadeUp overflow-hidden shadow-soft gradient-border"
      data-oid="oug9b65"
    >
      <div
        className="card-header flex flex-row justify-between items-center py-3"
        data-oid="fpob7_x"
      >
        <div className="flex items-center" data-oid="6o9ctmt">
          <div
            className="w-8 h-8 bg-[#364949] rounded-full flex items-center justify-center mr-3 border-2 border-[#93ec93]"
            data-oid="4n6n-u6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-[#93ec93]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              data-oid="p:f-j9y"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                data-oid="f:40zmc"
              />
            </svg>
          </div>
          <h3
            className="font-medium text-lg text-[#f5f5f5] m-0 truncate pr-2"
            data-oid="m3-4ic3"
          >
            {partner.name}
          </h3>
        </div>
        <div className="flex flex-col items-end" data-oid="oe9m-m6">
          <span className="text-xs text-[#ffeed6]" data-oid="4swtiko">
            Payout
          </span>
          <span
            className="text-2xl font-bold text-[#dd7895] whitespace-nowrap animate-pulse"
            data-oid="3pe2xy_"
          >
            ${partner.rounded}
          </span>
        </div>
      </div>

      <div className="card-body p-4" data-oid="szfoc81">
        <div
          className="flex justify-between items-center mb-3 bg-[#364949] rounded-md p-2"
          data-oid="klie05e"
        >
          <div className="flex items-center" data-oid="wq_48ri">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-[#9fd6e9]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              data-oid="5kj6xrq"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                data-oid="7hr34zu"
              />
            </svg>
            <span className="font-medium text-[#ffeed6]" data-oid="r9s1222">
              Hours:
            </span>
          </div>
          <span
            className="bg-[#1E3535] px-3 py-1 rounded-full text-[#f5f5f5] text-sm font-medium"
            data-oid="zgp-ih7"
          >
            {partner.hours}
          </span>
        </div>

        <div className="bg-[#1E3535] rounded-md p-3 mb-2" data-oid="m3l89p6">
          <div className="text-xs mb-1 text-[#9fd6e9]" data-oid="r-3lbb3">
            Calculation
          </div>
          <div
            className="text-sm flex flex-wrap items-center text-[#f5f5f5] break-words"
            data-oid="ccn0gbe"
          >
            <span className="mr-1 font-medium" data-oid="aq:n3hs">
              {partner.hours}
            </span>
            <span className="text-[#ffeed6] mx-1" data-oid="9fr1fsg">
              ×
            </span>
            <span
              className="mx-1 text-[#9fd6e9] font-medium"
              data-oid="_73o98x"
            >
              ${(Math.floor(hourlyRate * 100) / 100).toFixed(2)}
            </span>
            <span className="text-[#ffeed6] mx-1" data-oid="4oaghah">
              =
            </span>
            <span
              className="mx-1 text-[#ffeed6] font-medium"
              data-oid="9n9u3ns"
            >
              ${(partner.hours * hourlyRate).toFixed(2)}
            </span>
            <span className="text-[#ffeed6] mx-1" data-oid="qunhe1e">
              →
            </span>
            <span className="ml-1 font-bold text-[#dd7895]" data-oid=".ij435.">
              ${partner.rounded}
            </span>
          </div>
        </div>
      </div>

      <div className="card-footer p-3" data-oid="s1s1yv9">
        <div className="w-full" data-oid="l:_74as">
          <div
            className="mb-2 text-sm font-medium text-[#ffeed6] flex items-center"
            data-oid="0ifv0v:"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              data-oid="xxyvc86"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                data-oid="dsu.su_"
              />
            </svg>
            Bill Breakdown:
          </div>
          <div className="flex flex-wrap gap-2" data-oid="h_33zm3">
            {[...partner.billBreakdown]
              .sort((a, b) => b.denomination - a.denomination) // Sort in descending order
              .map((bill, index) => {
                const billClass = getBillClass(bill.denomination);
                return (
                  <div
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm transition-all hover:shadow-md hover:scale-105 ${billClass}`}
                    data-oid="f-3qu3z"
                  >
                    {bill.quantity}×${bill.denomination}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
