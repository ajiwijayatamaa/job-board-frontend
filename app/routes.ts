import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "pages/login.tsx"),
  route("/register", "pages/register.tsx"),
  route("/organizer/dashboard", "pages/organizer/dashboard.tsx"),
  route("/events/:slug", "pages/customer/even-detail.tsx"),
  route("/reset-password/:token", "pages/reset-password.tsx"),
] satisfies RouteConfig;
