import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import { TipContextProvider } from "@/context/TipContext";
import { AppLayout } from "@/components/layout/AppLayout";
import StorePreview from "@/pages/StorePreview";
import TeamPreview from "@/pages/TeamPreview";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/store" component={StorePreview} />
      <Route path="/team" component={TeamPreview} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TipContextProvider>
          <AppLayout>
            <Router />
          </AppLayout>
          <Toaster />
        </TipContextProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
