import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { FloatingAgent } from "./components/FloatingAgent";
import Dashboard from "./pages/Dashboard";
import Families from "./pages/Families";
import DocumentReader from "./pages/DocumentReader";
import Compare from "./pages/Compare";
import Obligations from "./pages/Obligations";
import ContractAgent from "./pages/ContractAgent";
import Digitization from "./pages/Digitization";
import NotFound from "./pages/NotFound";
import { V2Layout } from "./components/v2/V2Layout";
import V2Dashboard from "./pages/v2/V2Dashboard";
import V2Drafting from "./pages/v2/V2Drafting";
import V2Contracts from "./pages/v2/V2Contracts";
import V2Redline from "./pages/v2/V2Redline";
import V2Upload from "./pages/v2/V2Upload";
import V2Obligations from "./pages/v2/V2Obligations";
import V2Agent from "./pages/v2/V2Agent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/families" element={<Families />} />
            <Route path="/families/:familyId" element={<Families />} />
            <Route path="/reader/:contractId" element={<DocumentReader />} />
            <Route path="/reader" element={<DocumentReader />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/obligations" element={<Obligations />} />
            <Route path="/agent" element={<ContractAgent />} />
            <Route path="/digitization" element={<Digitization />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingAgent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
