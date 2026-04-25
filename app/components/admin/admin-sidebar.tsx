import {
  BarChart3,
  Briefcase,
  Building2,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  ChevronRight,
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
      style={{ background: "#0f172a" }}
    >
      <SidebarContent style={{ background: "#0f172a" }}>
        {/* Brand */}
        <div
          className={cn(
            "flex items-center gap-3 px-5 py-5",
            collapsed && "justify-center px-3",
          )}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#f97316" }}
          >
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-white font-bold text-sm tracking-tight leading-none">
                HireSpace
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                Employer Portal
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          className="mx-4 mb-4"
          style={{ height: "1px", background: "#1e293b" }}
        />

        {/* User Card */}
        {!collapsed && (
          <div
            className="mx-3 mb-4 p-3 rounded-xl"
            style={{ background: "#1e293b" }}
          >
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden"
                  style={{ background: "#334155" }}
                >
                  {user?.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.fullName ?? "Admin"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4" style={{ color: "#94a3b8" }} />
                  )}
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                  style={{ background: "#22c55e", borderColor: "#1e293b" }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate leading-none">
                  {user?.fullName ?? "Admin"}
                </p>
                <p
                  className="text-xs mt-0.5 truncate"
                  style={{ color: "#64748b" }}
                >
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Label */}
        {!collapsed && (
          <p
            className="px-5 mb-2 text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "#475569" }}
          >
            Navigation
          </p>
        )}

        {/* Menu */}
        <SidebarGroup className="px-3">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const active = isActive(item.url, item.exact);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group",
                          collapsed && "justify-center px-2.5",
                        )}
                        style={{
                          background: active ? "#1d4ed8" : "transparent",
                          color: active ? "#ffffff" : "#94a3b8",
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.background = "#1e293b";
                            e.currentTarget.style.color = "#e2e8f0";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#94a3b8";
                          }
                        }}
                      >
                        <item.icon
                          className="w-[18px] h-[18px] shrink-0"
                          style={{ color: active ? "#93c5fd" : "#475569" }}
                        />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-sm font-medium">
                              {item.title}
                            </span>
                            {active && (
                              <ChevronRight
                                className="w-3.5 h-3.5"
                                style={{ color: "#93c5fd" }}
                              />
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

      {/* Footer */}
      <SidebarFooter
        className="px-3 py-3"
        style={{ background: "#0f172a", borderTop: "1px solid #1e293b" }}
      >
        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-150",
            collapsed && "justify-center",
          )}
          style={{ color: "#475569" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#450a0a";
            e.currentTarget.style.color = "#f87171";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#475569";
          }}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
