import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppTabs from "@/components/AppTabs";
import { Partner } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UserPlusIcon, Loader2Icon } from "lucide-react";

export default function Partners() {
  const [newPartnerName, setNewPartnerName] = useState("");
  const { toast } = useToast();

  const {
    data: partners,
    isLoading,
    refetch,
  } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
  });

  const handleAddPartner = async () => {
    if (!newPartnerName.trim()) {
      toast({
        title: "Partner name required",
        description: "Please enter a name for the partner",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest("POST", "/api/partners", {
        name: newPartnerName.trim(),
      });
      setNewPartnerName("");
      refetch();
      toast({
        title: "Partner added",
        description: `${newPartnerName} has been added to partners`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to add partner",
        description: "An error occurred while adding the partner",
        variant: "destructive",
      });
    }
  };

  return (
    <main data-oid="y3163q.">
      <div className="max-w-3xl mx-auto mt-8" data-oid="acpygru">
        <div className="card" data-oid="071482a">
          <div className="card-header" data-oid="4vt0ae8">
            <div
              className="text-2xl font-semibold tracking-tight text-[#f5f5f5]"
              data-oid="0h95-iv"
            >
              Manage Partners
            </div>
          </div>

          <div className="card-body p-6" data-oid="zux2zg:">
            <div className="flex gap-4 mb-8" data-oid="u3f3-p-">
              <input
                type="text"
                placeholder="Enter partner name"
                value={newPartnerName}
                onChange={(e) => setNewPartnerName(e.target.value)}
                className="input-field flex-grow"
                data-oid="8a8zis3"
              />

              <button
                onClick={handleAddPartner}
                className="btn btn-primary"
                data-oid="ff2pymi"
              >
                <UserPlusIcon className="h-4 w-4 mr-2" data-oid="2yrnl:8" />
                Add Partner
              </button>
            </div>

            <div className="space-y-4" data-oid="79fq26w">
              <h3
                className="font-semibold text-lg text-[#f5f5f5]"
                data-oid="1-l.xg."
              >
                Partner List
              </h3>

              {isLoading ? (
                <div className="text-center py-8" data-oid="xtp3suj">
                  <Loader2Icon
                    className="h-8 w-8 text-[#93ec93] animate-spin mx-auto"
                    data-oid="iozhf39"
                  />

                  <p className="mt-2 text-[#f5f5f5]" data-oid="6p.athg">
                    Loading partners...
                  </p>
                </div>
              ) : partners && partners.length > 0 ? (
                <div className="grid gap-4" data-oid="2ayea3l">
                  {partners.map((partner) => (
                    <div
                      key={partner.id}
                      className="flex items-center justify-between p-4 bg-[#364949] rounded-lg border border-[#4c6767]"
                      data-oid="oe_ch8p"
                    >
                      <div
                        className="flex items-center gap-3"
                        data-oid="1n4jgxz"
                      >
                        <div
                          className="bg-[#1e3535] text-[#f5f5f5] h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium"
                          data-oid="-:_7br:"
                        >
                          {partner.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span
                          className="font-medium text-[#f5f5f5]"
                          data-oid="8dwq6_o"
                        >
                          {partner.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-8 bg-[#364949] rounded-lg border border-[#4c6767]"
                  data-oid="bm3-r0w"
                >
                  <p className="text-[#bfbfbf]" data-oid="sucfq3q">
                    No partners added yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
