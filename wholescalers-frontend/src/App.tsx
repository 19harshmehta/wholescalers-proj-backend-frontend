import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WholesalerDashboard from "./pages/wholesaler/WholesalerDashboard";
import WholesalerProducts from "./pages/wholesaler/WholesalerProducts";
import WholesalerOrders from "./pages/wholesaler/WholesalerOrders";
import WholesalerInvoices from "./pages/wholesaler/WholesalerInvoices";
import WholesalerReports from "./pages/wholesaler/WholesalerReports";
import RetailerDashboard from "./pages/retailer/RetailerDashboard";
import RetailerProducts from "./pages/retailer/RetailerProducts";
import RetailerOrders from "./pages/retailer/RetailerOrders";
import RetailerInvoices from "./pages/retailer/RetailerInvoices";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Wholesaler Routes */}
            <Route path="/wholesaler/dashboard" element={
              <ProtectedRoute allowedRole="wholesaler">
                <WholesalerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/wholesaler/products" element={
              <ProtectedRoute allowedRole="wholesaler">
                <WholesalerProducts />
              </ProtectedRoute>
            } />
            <Route path="/wholesaler/orders" element={
              <ProtectedRoute allowedRole="wholesaler">
                <WholesalerOrders />
              </ProtectedRoute>
            } />
            <Route path="/wholesaler/invoices" element={
              <ProtectedRoute allowedRole="wholesaler">
                <WholesalerInvoices />
              </ProtectedRoute>
            } />
            <Route path="/wholesaler/reports" element={
              <ProtectedRoute allowedRole="wholesaler">
                <WholesalerReports />
              </ProtectedRoute>
            } />
            
            {/* Retailer Routes */}
            <Route path="/retailer/dashboard" element={
              <ProtectedRoute allowedRole="retailer">
                <RetailerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/retailer/products" element={
              <ProtectedRoute allowedRole="retailer">
                <RetailerProducts />
              </ProtectedRoute>
            } />
            <Route path="/retailer/orders" element={
              <ProtectedRoute allowedRole="retailer">
                <RetailerOrders />
              </ProtectedRoute>
            } />
            <Route path="/retailer/invoices" element={
              <ProtectedRoute allowedRole="retailer">
                <RetailerInvoices />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
