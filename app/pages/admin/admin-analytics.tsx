import AdminLayout from "~/components/admin/admin-layout";
import { adminApplicants, adminJobPostings } from "~/data/admin-data";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = [
  "hsl(213, 80%, 50%)",
  "hsl(160, 60%, 45%)",
  "hsl(45, 90%, 55%)",
  "hsl(0, 72%, 55%)",
  "hsl(280, 60%, 55%)",
  "hsl(190, 70%, 50%)",
];

const parsesalary = (s: string) => {
  const match = s.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

const getAgeGroup = (age: number) => {
  if (age < 25) return "< 25";
  if (age <= 28) return "25-28";
  if (age <= 31) return "29-31";
  return "32+";
};

// Demographics
const genderData = Object.entries(
  adminApplicants.reduce<Record<string, number>>((acc, a) => {
    acc[a.gender] = (acc[a.gender] || 0) + 1;
    return acc;
  }, {})
).map(([name, value]) => ({ name, value }));

const ageData = Object.entries(
  adminApplicants.reduce<Record<string, number>>((acc, a) => {
    const g = getAgeGroup(a.age);
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {})
).map(([name, value]) => ({ name, value }));

const locationData = Object.entries(
  adminApplicants.reduce<Record<string, number>>((acc, a) => {
    acc[a.address] = (acc[a.address] || 0) + 1;
    return acc;
  }, {})
)
  .sort((a, b) => b[1] - a[1])
  .map(([name, value]) => ({ name, value }));

const educationData = Object.entries(
  adminApplicants.reduce<Record<string, number>>((acc, a) => {
    const level = a.education.startsWith("S2") ? "S2 (Master)" : "S1 (Bachelor)";
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {})
).map(([name, value]) => ({ name, value }));

// Salary trends per job
const salaryByJob = adminJobPostings
  .filter((j) => j.status === "published")
  .map((job) => {
    const applicants = adminApplicants.filter((a) => a.jobId === job.id);
    const salaries = applicants.map((a) => parseFloat(a.salaryExpectation.replace(/[^\d]/g, "")));
    const avg = salaries.length ? Math.round(salaries.reduce((s, v) => s + v, 0) / salaries.length) : 0;
    return { name: job.title.split(" ").slice(0, 2).join(" "), avg: avg / 1_000_000, min: salaries.length ? Math.min(...salaries) / 1_000_000 : 0, max: salaries.length ? Math.max(...salaries) / 1_000_000 : 0 };
  });

// Application interests by category
const categoryInterest = Object.entries(
  adminApplicants.reduce<Record<string, number>>((acc, a) => {
    const job = adminJobPostings.find((j) => j.id === a.jobId);
    if (job) acc[job.category] = (acc[job.category] || 0) + 1;
    return acc;
  }, {})
).map(([name, value]) => ({ name, value }));

// Status distribution
const statusData = Object.entries(
  adminApplicants.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {})
).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card className="card-shadow">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const AdminAnalytics = () => (
  <AdminLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Detailed insights into applicants & job postings</p>
      </div>

      <Tabs defaultValue="demographics">
        <TabsList>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="salary">Salary Trends</TabsTrigger>
          <TabsTrigger value="interests">Application Interests</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="demographics" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <ChartCard title="Gender Distribution">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(((percent ?? 0) * 100)).toFixed(0)}%`}
                  >
                    {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Age Distribution">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(213, 80%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Top Locations">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={locationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                  <XAxis type="number" allowDecimals={false} fontSize={12} />
                  <YAxis dataKey="name" type="category" width={120} fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(160, 60%, 45%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Education Level">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={educationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(((percent ?? 0) * 100)).toFixed(0)}%`}
                  >
                    {educationData.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="salary" className="mt-4">
          <ChartCard title="Average Salary Expectation by Job (in millions Rp)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salaryByJob}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(v: any) => `Rp ${v}M`} />
                <Legend />
                <Bar dataKey="min" name="Min" fill="hsl(190, 70%, 50%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avg" name="Avg" fill="hsl(213, 80%, 50%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="max" name="Max" fill="hsl(280, 60%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>

        <TabsContent value="interests" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <ChartCard title="Applications by Category">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={categoryInterest} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                    {categoryInterest.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Applicants per Job Posting">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={adminJobPostings.map((j) => ({ name: j.title.split(" ").slice(0, 2).join(" "), applicants: adminApplicants.filter((a) => a.jobId === j.id).length }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="applicants" fill="hsl(45, 90%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <ChartCard title="Application Status Distribution">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Conversion Funnel">
              <div className="space-y-3 pt-2">
                {["submitted", "processed", "interviewed", "accepted"].map((status, i) => {
                  const count = adminApplicants.filter((a) => a.status === status).length;
                  const pct = Math.round((count / adminApplicants.length) * 100);
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-foreground">{status}</span>
                        <span className="text-muted-foreground">{count} ({pct}%)</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: COLORS[i] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </AdminLayout>
);

export default AdminAnalytics;
