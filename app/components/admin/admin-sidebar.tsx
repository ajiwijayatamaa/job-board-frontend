import {
  BarChart3,
  Briefcase,
  Building2,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  ChevronRight,
  Sparkles,
  Home,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { useAuth } from "~/stores/useAuth";
import { cn } from "~/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, exact: true },
  { title: "Job Postings", url: "/admin/jobs", icon: Briefcase, exact: false },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
    exact: false,
  },
  { title: "Settings", url: "/admin/profile", icon: Settings, exact: false },
];

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (url: string, exact: boolean) =>
    exact ? location.pathname === url : location.pathname.startsWith(url);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0"
      style={{ background: "#0F2342" }} // Navy Base
    >
      <SidebarContent
        style={{ background: "#0F2342" }}
        className="overflow-x-hidden"
      >
        {/* Brand Section */}
        <div
          className={cn(
            "flex items-center gap-3 px-6 py-8",
            collapsed && "justify-center px-3",
          )}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/20"
            style={{ background: "#1D5FAD" }} // Professional Blue
          >
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-white font-black text-lg tracking-tighter leading-none italic uppercase">
                HIRE<span className="text-[#1D5FAD]">SPACE</span>
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1 h-1 rounded-full bg-teal-400 animate-pulse" />
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Employer Portal
                </p>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Card - Elevated Style */}
        {!collapsed && (
          <div className="px-4 mb-8">
            <div
              className="p-4 rounded-[1.5rem] border border-white/5 transition-all hover:bg-white/5"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border-2 border-[#1D5FAD]/30"
                    style={{ background: "#162E51" }}
                  >
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.fullName ?? "Admin"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-teal-500 border-2 border-[#0F2342] rounded-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-white truncate uppercase tracking-tight">
                    {user?.fullName ?? "Administrator"}
                  </p>
                  <p className="text-[10px] font-medium text-slate-500 truncate mt-0.5">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Label */}
        {!collapsed && (
          <div className="px-7 mb-4 flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-[#1D5FAD]" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
              Main Menu
            </p>
          </div>
        )}

        {/* Menu Items */}
        <SidebarGroup className="px-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => {
                const active = isActive(item.url, item.exact);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                          collapsed && "justify-center px-0",
                        )}
                        style={{
                          background: active ? "#1D5FAD" : "transparent",
                        }}
                      >
                        {/* Glow effect for active item */}
                        {active && (
                          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                        )}

                        <item.icon
                          className={cn(
                            "w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                          )}
                          style={{ color: active ? "#FFFFFF" : "#5C7596" }}
                        />

                        {!collapsed && (
                          <>
                            <span
                              className={cn(
                                "flex-1 text-xs font-bold tracking-wide transition-colors",
                                active
                                  ? "text-white"
                                  : "text-slate-400 group-hover:text-white",
                              )}
                            >
                              {item.title}
                            </span>
                            {active && (
                              <ChevronRight className="w-4 h-4 text-white/50" />
                            )}
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Section */}
      <SidebarFooter
        className="p-4"
        style={{
          background: "#0F2342",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Link
          to="/"
          className={cn(
            "flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-300 group hover:bg-white/5",
            collapsed && "justify-center px-0",
          )}
          style={{ color: "#5C7596" }}
        >
          <Home className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-white" />
          {!collapsed && (
            <span className="text-xs font-bold tracking-widest uppercase group-hover:text-white transition-colors">
              Back to Home
            </span>
          )}
        </Link>
        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-300 group hover:bg-rose-500/10",
            collapsed && "justify-center px-0",
          )}
          style={{ color: "#5C7596" }}
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:text-rose-400 group-hover:rotate-12 transition-all" />
          {!collapsed && (
            <span className="text-xs font-bold tracking-widest uppercase group-hover:text-rose-400">
              Logout System
            </span>
          )}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
