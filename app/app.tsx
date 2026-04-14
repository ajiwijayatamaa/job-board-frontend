import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster as Sonner } from "~/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/index";
import Jobs from "./pages/jobs";
import JobDetail from "./pages/job-detail";
import Companies from "./pages/company";
import CompanyDetail from "./pages/company-details";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import Dashboard from "./pages/dashboard";
import AdminOverview from "./pages/admin/admin-overview";
import AdminJobList from "./pages/admin/admin-job-list";
import AdminJobForm from "./pages/admin/admin-job-form";
import AdminJobDetail from "./pages/admin/admin-job-detail";
import AdminInterviews from "./pages/admin/admin-interviews";
import AdminAnalytics from "./pages/admin/admin-analytics";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/jobs" element={<AdminJobList />} />
          <Route path="/admin/jobs/new" element={<AdminJobForm />} />
          <Route path="/admin/jobs/:id" element={<AdminJobDetail />} />
          <Route path="/admin/jobs/:id/edit" element={<AdminJobForm />} />
          <Route path="/admin/interviews" element={<AdminInterviews />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
