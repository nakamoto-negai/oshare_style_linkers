
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import QA from "./pages/QA";
import QASimpleTest from "./pages/QASimpleTest";
import QAList from "./pages/QAList";
import QuestionDetail from "./pages/QuestionDetail";
import CreateQuestion from "./pages/CreateQuestion";
import Community from "./pages/Community";
import Recycle from "./pages/Recycle";
import About from "./pages/About";
import Items from "./pages/Items";
import ItemsTest from "./pages/ItemsTest";
import ItemsSimple from "./pages/ItemsSimple";
import ItemsFixed from "./pages/ItemsFixed";
import ItemDetail from "./pages/ItemDetail";
import ShoppingCart from "./pages/ShoppingCart";
import Checkout from "./pages/Checkout";
import OrderDetail from "./pages/OrderDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/features" element={<Features />} />
            <Route path="/qa" element={<QAList />} />
            <Route path="/qa/create" element={<CreateQuestion />} />
            <Route path="/qa/:id" element={<QuestionDetail />} />
            <Route path="/community" element={<Community />} />
            <Route path="/recycle" element={<Recycle />} />
            <Route path="/about" element={<About />} />
            <Route path="/items" element={<ItemsFixed />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/items-simple" element={<ItemsSimple />} />
            <Route path="/items-original" element={<Items />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
