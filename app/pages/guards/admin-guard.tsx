import ProtectedRoute from "../protected-route";

export default function AdminGuard() {
  return <ProtectedRoute allowedRoles={["ADMIN"]} />;
}