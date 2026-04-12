import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Search,
  Ticket,
  User,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Input } from "~/components/ui/input";
import { useAuth } from "~/stores/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Tetap Konsisten */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Ticket className="h-5 w-5 text-orange-400 rotate-12" />
            </div>
            <span className="text-xl font-black tracking-tighter text-zinc-900 italic">
              EVENTIFIRE<span className="text-orange-500">.</span>
            </span>
          </Link>

          {/* Navigasi Tengah - DIBALIKKAN KE ASLI (Hanya Browse Events) */}
          <div className="hidden items-center md:flex">
            <Link
              to="/"
              className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all rounded-full ${
                isActive("/")
                  ? "bg-orange-50 text-orange-600"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              Browse Events
            </Link>
          </div>

          {/* Bagian Kanan */}
          <div className="flex items-center gap-4">
            {!location.pathname.startsWith("/organizer") && (
              <div className="hidden max-w-[180px] relative lg:block">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                <Input
                  type="search"
                  placeholder="Search events..."
                  className="w-full pl-9 bg-zinc-100 border-none rounded-full h-9 text-[11px] font-bold focus-visible:ring-2 focus-visible:ring-orange-500/20 transition-all"
                />
              </div>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-full hover:bg-zinc-100 transition-all border border-transparent hover:border-zinc-200"
                >
                  <div className="h-8 w-8 rounded-full border-2 border-orange-400/30 overflow-hidden bg-zinc-100 shadow-inner flex items-center justify-center">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        className="h-full w-full object-cover"
                        alt="pfp"
                      />
                    ) : (
                      <User className="h-4 w-4 text-zinc-400" />
                    )}
                  </div>
                  <span className="hidden md:inline text-[11px] font-black uppercase tracking-tight text-zinc-700">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`h-3 w-3 text-zinc-400 transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-[-1]"
                        onClick={() => setMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-3 w-56 rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl shadow-zinc-200/50 z-50 overflow-hidden"
                      >
                        {user.role === "ORGANIZER" && (
                          <Link
                            to="/organizer/dashboard"
                            className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-black uppercase bg-zinc-900 text-white rounded-xl mb-1 hover:bg-black transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4 text-orange-400" />{" "}
                            Organizer Dashboard
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-black uppercase text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
                        >
                          <Settings className="h-4 w-4" /> Profile Settings
                        </Link>

                        <div className="my-1 border-t border-zinc-100" />

                        <button
                          onClick={() => logout()}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-[11px] font-black uppercase text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-[11px] font-black uppercase text-zinc-600 hover:text-zinc-900"
                >
                  Login
                </Link>
                <Link to="/register">
                  <button className="bg-zinc-900 text-white px-5 py-2 text-[11px] font-black uppercase rounded-full shadow-lg shadow-zinc-900/20 hover:bg-black transition-all active:scale-95">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
