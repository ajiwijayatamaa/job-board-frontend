import { Link } from "react-router";
import { Briefcase, Building2, MapPin, TrendingUp, Users, GraduationCap } from "lucide-react";

const stats = [
  { icon: Briefcase, label: "Lowongan Aktif", value: "10,000+", color: "text-primary" },
  { icon: Building2, label: "Perusahaan", value: "2,500+", color: "text-accent" },
  { icon: Users, label: "Pencari Kerja", value: "50,000+", color: "text-primary" },
  { icon: TrendingUp, label: "Lowongan Terisi", value: "8,000+", color: "text-accent" },
];

const popularCategories = [
  { icon: "💻", label: "Teknologi", count: 1240 },
  { icon: "📊", label: "Keuangan", count: 890 },
  { icon: "🎨", label: "Desain", count: 650 },
  { icon: "📈", label: "Pemasaran", count: 720 },
  { icon: "🏗️", label: "Teknik", count: 530 },
  { icon: "🏥", label: "Kesehatan", count: 410 },
  { icon: "📚", label: "Pendidikan", count: 380 },
  { icon: "🛍️", label: "Penjualan", count: 960 },
];

const FilterSection = () => (
  <section className="bg-card py-16">
    <div className="container">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center rounded-xl border border-border bg-background p-6 text-center card-shadow">
            <stat.icon className={`mb-2 h-8 w-8 ${stat.color}`} />
            <span className="text-2xl font-bold text-foreground">{stat.value}</span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="mb-2 text-center text-2xl font-bold text-foreground md:text-3xl">
          Cari Berdasarkan Kategori
        </h2>
        <p className="mb-8 text-center text-muted-foreground">
          Jelajahi berbagai peluang di berbagai industri
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {popularCategories.map((cat) => (
            <Link
              key={cat.label}
              to={`/jobs?category=${cat.label}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-all hover:border-primary/30 hover:card-shadow-hover"
            >
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <div className="font-medium text-foreground">{cat.label}</div>
                <div className="text-xs text-muted-foreground">{cat.count} lowongan</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default FilterSection;
