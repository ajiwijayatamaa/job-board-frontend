import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "~/stores/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: ("USER" | "ADMIN")[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  // 1. Cek apakah user sudah login
  if (!user) {
    // Simpan lokasi asal agar setelah login bisa diarahkan kembali ke sini
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Cek apakah role user diizinkan mengakses rute ini
  if (allowedRoles && !allowedRoles.includes(user.role as any)) {
    // Jika role tidak sesuai, arahkan ke dashboard masing-masing
    // PENTING: Pastikan link di Sidebar/Navbar sudah mengarah ke rute yang benar (/admin/profile)
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/"} replace />;
  }

  // 3. Jika semua valid, render anak rute (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;