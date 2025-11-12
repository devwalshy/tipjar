import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { TipContextProvider } from "@/context/TipContext";

function AppNav() {
  const [location] = useLocation();

  return null;
}

function Router() {
  return (
    <Switch data-oid=".tzfp.i">
      <Route path="/" component={Home} data-oid="k5pyytv" />
      <Route component={NotFound} data-oid="g1wylr0" />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient} data-oid="2k9usay">
      <TooltipProvider data-oid="em3v9aa">
        <TipContextProvider data-oid=":xrr:_1">
          <div
            className="flex-grow w-full bg-[#2F4F4F] text-[#f5f5f5] min-h-screen flex flex-col"
            data-oid="5:lrb9k"
          >
            <main
              className="max-w-7xl mx-auto py-6 px-4 sm:px-6 flex-grow"
              data-oid="fba9huf"
            >
              <AppNav data-oid="j-8c7es" />
              <div className="flex-grow" data-oid="c5.ni9v">
                <Router data-oid=":dm0ibn" />
              </div>
            </main>
            <footer
              className="w-full border-t border-[#3A5F5F] mt-8 py-4"
              data-oid="fi0xmb5"
            >
              <div
                className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm"
                data-oid="r.gdxv4"
              >
                <div className="font-medium text-[#f5f5f5]" data-oid="onl32t4">
                  Made by William Walsh
                </div>
                <div className="text-[#9fd6e9] text-xs mt-1" data-oid="h5jh13p">
                  Starbucks Store# 69600
                </div>
              </div>
            </footer>
          </div>
          <Toaster data-oid="clq_bfv" />
        </TipContextProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
