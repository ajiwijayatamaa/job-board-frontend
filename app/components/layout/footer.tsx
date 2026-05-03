import { Link } from "react-router";
import { Briefcase } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Pencari Kerja</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Temukan ribuan peluang kerja dari perusahaan ternama di seluruh Indonesia
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-foreground">Untuk Pencari Kerja</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/jobs" className="hover:text-primary">Lihat Daftar Pekerjaan</Link>
            <Link to="/companies" className="hover:text-primary">Lihat Daftar Perusahaan</Link>
            <Link to="/register" className="hover:text-primary">Buat Akun</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-foreground">Untuk Perusahaan</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/register" className="hover:text-primary">Buat Lamaran</Link>
            <Link to="/register" className="hover:text-primary">Buat Akun Perusahaan</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-foreground">Dukungan</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="cursor-pointer hover:text-primary">Pusat Bantuan</span>
            <span className="cursor-pointer hover:text-primary">Kebijakan Privasi</span>
            <span className="cursor-pointer hover:text-primary">Syarat dan Ketentuan</span>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        © 2026 Pencari Kerja
      </div>
    </div>
  </footer>
);

export default Footer;
