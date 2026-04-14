import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import AdminSidebar from "./admin-sidebar";
import { Link } from "react-router";
import { Briefcase, ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 h-14 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Link to="/admin" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Briefcase className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground hidden sm:inline">Admin Panel</span>
              </Link>
            </div>
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" /> Back to Site
              </Button>
            </Link>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
