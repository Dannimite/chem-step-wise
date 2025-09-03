import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/ui/app-sidebar";
import Index from "./pages/Index";
import GasLaws from "./pages/GasLaws";
import PeriodicTable from "./pages/PeriodicTable";
import NuclearReactions from "./pages/NuclearReactions";
import Stoichiometry from "./pages/Stoichiometry";
import Equations from "./pages/Equations";
import MolarMass from "./pages/MolarMass";
import Concentration from "./pages/Concentration";
import PHPage from "./pages/pH";
import Thermochemistry from "./pages/Thermochemistry";
import Examples from "./pages/Examples";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="h-14 flex items-center border-b border-border/50 bg-card/50 backdrop-blur-sm">
                <SidebarTrigger className="ml-4" />
                <div className="flex-1 px-4">
                  <h1 className="text-lg font-semibold text-foreground">ChemSolver</h1>
                </div>
              </header>
              <main className="flex-1 p-6 chemistry-scroll overflow-auto">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/gas-laws" element={<GasLaws />} />
                  <Route path="/periodic-table" element={<PeriodicTable />} />
                  <Route path="/nuclear-reactions" element={<NuclearReactions />} />
                  <Route path="/stoichiometry" element={<Stoichiometry />} />
                  <Route path="/equations" element={<Equations />} />
                  <Route path="/molar-mass" element={<MolarMass />} />
                  <Route path="/concentration" element={<Concentration />} />
                  <Route path="/ph" element={<PHPage />} />
                  <Route path="/thermochemistry" element={<Thermochemistry />} />
                  <Route path="/examples" element={<Examples />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
