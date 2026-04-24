import ProtectedRoute from "../protected-route";

export default function UserGuard() {
  return <ProtectedRoute allowedRoles={["USER"]} />;
}