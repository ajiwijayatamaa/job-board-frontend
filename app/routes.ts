import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/index.tsx"),

  route("/jobs", "pages/jobs.tsx"),
  route("/jobs/:id", "pages/job-detail.tsx"),

  route("/companies", "pages/company.tsx"),
  route("/companies/:id", "pages/company-details.tsx"),

  route("/dashboard", "pages/dashboard.tsx"),
  route("/profile", "pages/profile.tsx"),

  route("/login", "pages/login.tsx"),
  route("/register", "pages/register.tsx"),

  route("/admin", "pages/admin/admin-overview.tsx"),
  route("/admin/jobs", "pages/admin/admin-job-list.tsx"),
  route("/admin/jobs/new", "pages/admin/admin-job-new.tsx"),
  route("/admin/jobs/:id", "pages/admin/admin-job-detail.tsx"),
  route("/admin/jobs/:id/edit", "pages/admin/admin-job-edit.tsx"),
  route("/admin/interviews", "pages/admin/admin-interviews.tsx"),
  route("/admin/analytics", "pages/admin/admin-analytics.tsx"),

  route("*", "pages/not-found.tsx"),
] satisfies RouteConfig;
