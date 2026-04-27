import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  route("/jobs", "pages/jobs.tsx"),
  route("/jobs/:id", "pages/job-detail.tsx"),

  route("/companies", "pages/company.tsx"),
  route("/companies/:id", "pages/company-details.tsx"),

  // ── USER ──────────────────────────────────────────────────────────────────
  layout("pages/guards/user-guard.tsx", [
    route("/dashboard", "pages/dashboard.tsx"),
    route("/profile", "pages/profile.tsx"),
    route("/jobs/:jobId/take-test", "pages/user/take-test.tsx"),
    route("/jobs/:jobId/test-result", "pages/user/test-result.tsx"),
  ]),
  // ── SHARED ──────────────────────────────────────────────────────────────────
  route("/login", "pages/login.tsx"),
  route("/register", "pages/register.tsx"),
  route("/reset-password", "pages/reset-password.tsx"),
  route("/forgot-password", "pages/forgot-password.tsx"),
  route("/verify-email", "pages/verify-email.tsx"),

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  layout("pages/guards/admin-guard.tsx", [
    route("/admin", "pages/admin/admin-overview.tsx"),
    route("/admin/profile", "pages/admin/admin-profile.tsx"),
    route("/admin/analytics", "pages/admin/admin-analytics.tsx"),

    route("/admin/jobs", "pages/admin/admin-job-list.tsx"),
    route("/admin/jobs/create", "pages/admin/admin-job-create.tsx"),
    route("/admin/jobs/:id", "pages/admin/admin-job-detail.tsx"),
    route("/admin/jobs/:id/edit", "pages/admin/admin-job-edit.tsx"),
    route("/admin/jobs/:id/interviews", "pages/admin/admin-interviews.tsx"),
    route(
      "/admin/jobs/:jobId/pre-selection-test/create",
      "pages/admin/admin-pre-selection-test-create.tsx",
    ),
    route(
      "/admin/jobs/:jobId/pre-selection-test/edit",
      "pages/admin/admin-pre-selection-test-edit.tsx",
    ),
    route(
      "/admin/pre-selection-tests/:testId/results",
      "pages/admin/admin-test-results.tsx",
    ),
    route(
      "/admin/pre-selection-tests/:testResultId/answers",
      "pages/admin/admin-test-answer-detail.tsx",
    ),
  ]),

  route("*", "pages/not-found.tsx"),
] satisfies RouteConfig;
