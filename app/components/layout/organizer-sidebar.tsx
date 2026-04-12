import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  PlusCircle,
  Receipt,
  Settings,
  Ticket,
  Sparkles,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { cn } from "~/lib/utils";

const OrganizerSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/organizer/dashboard",
    },
    {
      title: "Event Saya",
      icon: Calendar,
      href: "/organizer/events",
    },
    {
      title: "Buat Event",
      icon: PlusCircle,
      href: "/organizer/events/create",
    },
    {
      title: "Transaksi",
      icon: Receipt,
      href: "/organizer/transactions",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/organizer/events") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen border-r border-zinc-200 bg-white transition-all duration-300 z-50 shadow-sm",
        collapsed ? "w-20" : "w-72",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header Branding */}
        <div
          className={cn(
            "flex h-20 items-center border-b border-zinc-100 px-4 transition-all",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed && (
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-lg shadow-orange-500/10 group-hover:scale-105 transition-transform">
                <Ticket className="h-5 w-5 text-orange-400 rotate-12" />
              </div>
              <span className="text-xl font-black tracking-tighter text-zinc-900 italic uppercase">
                EVENTIFIRE<span className="text-orange-500">.</span>
              </span>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 rounded-xl",
              collapsed && "h-12 w-12",
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          {/* Section Label */}
          {!collapsed && (
            <div className="px-2 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Menu Organizer
              </span>
            </div>
          )}

          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-widest transition-all group relative overflow-hidden",
                  isActive(item.href)
                    ? "bg-zinc-900 text-white shadow-md shadow-zinc-200"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
                  collapsed && "justify-center px-0",
                )}
              >
                {/* Active Indicator Accent */}
                {isActive(item.href) && !collapsed && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                )}

                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
                    isActive(item.href)
                      ? "text-orange-400"
                      : "text-zinc-400 group-hover:text-orange-500",
                  )}
                />

                {!collapsed && <span className="truncate">{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer / Settings */}
        <div className="p-4 mt-auto">
          <div className="border-t border-zinc-100 pt-4">
            <Link
              to="/profile"
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-widest text-zinc-500 transition-all hover:bg-zinc-50 hover:text-zinc-900 group",
                collapsed && "justify-center px-0",
                location.pathname === "/profile" && "bg-zinc-100 text-zinc-900",
              )}
            >
              <Settings className="h-5 w-5 flex-shrink-0 group-hover:rotate-45 transition-transform" />
              {!collapsed && <span>Pengaturan</span>}
            </Link>
          </div>

          {/* Decorator (Tampak seperti sobekan tiket kecil jika tidak collapsed) */}
          {!collapsed && (
            <div className="mt-4 px-4 py-3 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
              <p className="text-[9px] font-bold text-zinc-400 uppercase leading-tight">
                Mode Organizer <br />
                <span className="text-orange-500">
                  EVENTIFIRE Terverifikasi
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default OrganizerSidebar;
