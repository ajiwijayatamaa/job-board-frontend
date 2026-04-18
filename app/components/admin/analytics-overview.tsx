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

const salaryData = [
  { month: "Jan", avg: 4500 },
  { month: "Feb", avg: 4800 },
  { month: "Mar", avg: 5200 },
  { month: "Apr", avg: 5100 },
];

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
      <div className="grid grid-cols-1 gap-12">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-foreground uppercase tracking-wider">Demographics</p>
          <ResponsiveContainer width="100%" height={300}>
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

        <div className="space-y-4 border-t border-border pt-8">
          <p className="text-sm font-semibold text-foreground uppercase tracking-wider">Salary Trends</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => [`$${value}`, "Average Salary"]} />
              <Bar dataKey="avg" fill="hsl(213, 80%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4 border-t border-border pt-8">
          <p className="text-sm font-semibold text-foreground uppercase tracking-wider">Applications Interest</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis allowDecimals={false} fontSize={11} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(160, 60%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4 border-t border-border pt-8">
          <p className="text-sm font-semibold text-foreground uppercase tracking-wider">Pipeline</p>
          <div className="space-y-4 pt-1">
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
