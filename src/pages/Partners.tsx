import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppTabs from "@/components/AppTabs";
import { Partner } from "@shared/schema";
import { apiRequest } from "@/utils/queryClient";
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
    <main>
      <div className="max-w-3xl mx-auto mt-8">
        <div className="card">
          <div className="card-header">
            <div className="text-2xl font-semibold tracking-tight text-[#f5f5f5]">
              Manage Partners
            </div>
          </div>

          <div className="card-body p-6">
            <div className="flex gap-4 mb-8">
              <input
                type="text"
                placeholder="Enter partner name"
                value={newPartnerName}
                onChange={(e) => setNewPartnerName(e.target.value)}
                className="input-field flex-grow"
              />

              <button onClick={handleAddPartner} className="btn btn-primary">
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Add Partner
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-[#f5f5f5]">
                Partner List
              </h3>

              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2Icon className="h-8 w-8 text-[#93ec93] animate-spin mx-auto" />

                  <p className="mt-2 text-[#f5f5f5]">Loading partners...</p>
                </div>
              ) : partners && partners.length > 0 ? (
                <div className="grid gap-4">
                  {partners.map((partner) => (
                    <div
                      key={partner.id}
                      className="flex items-center justify-between p-4 bg-[#364949] rounded-lg border border-[#4c6767]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-[#1e3535] text-[#f5f5f5] h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium">
                          {partner.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#f5f5f5]">
                          {partner.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-[#364949] rounded-lg border border-[#4c6767]">
                  <p className="text-[#bfbfbf]">No partners added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
