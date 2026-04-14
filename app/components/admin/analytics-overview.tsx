import { adminApplicants, adminJobPostings } from "@/data/admin-data";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { BarChart3 } from "lucide-react";

const COLORS = [
  "hsl(213, 80%, 50%)",
  "hsl(160, 60%, 45%)",
  "hsl(45, 90%, 55%)",
  "hsl(0, 72%, 55%)",
  "hsl(280, 60%, 55%)",
];

const genderData = Object.entries(
  adminApplicants.reduce<Record<string, number>>((acc, a) => {
    acc[a.gender] = (acc[a.gender] || 0) + 1;
    return acc;
  }, {})
).map(([name, value]) => ({ name, value }));

const categoryData = Object.entries(
  adminApplicants.reduce<Record<string, number>>((acc, a) => {
    const job = adminJobPostings.find((j) => j.id === a.jobId);
    if (job) acc[job.category] = (acc[job.category] || 0) + 1;
    return acc;
  }, {})
).map(([name, value]) => ({ name, value }));

const statusData = Object.entries(
  adminApplicants.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {})
).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

const AnalyticsOverview = () => (
  <Card className="card-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle>Analytics Overview</CardTitle>
      <Link to="/admin/analytics">
        <Button variant="ghost" size="sm" className="gap-1">
          <BarChart3 className="h-4 w-4" /> View Details
        </Button>
      </Link>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Gender Split</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(((percent ?? 0) * 100)).toFixed(0)}%`}
              >
                {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">By Category</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis allowDecimals={false} fontSize={11} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(160, 60%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Pipeline Status</p>
          <div className="space-y-2 pt-1">
            {statusData.map((s, i) => {
              const pct = Math.round((s.value / adminApplicants.length) * 100);
              return (
                <div key={s.name}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-foreground">{s.name}</span>
                    <span className="text-muted-foreground">{s.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AnalyticsOverview;
