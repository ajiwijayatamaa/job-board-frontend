import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router";
import { CheckCircle2, XCircle, Loader2, Mail, ArrowRight } from "lucide-react";
import { axiosInstance } from "~/lib/axios";
import { Button } from "~/components/ui/button";
import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token verifikasi tidak ditemukan di URL.");
        return;
      }

      try {
        // Memanggil endpoint GET /auth/verify-email yang sudah ada di backend
        const response = await axiosInstance.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(response.data.message || "Email Anda telah berhasil diverifikasi.");
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.message || 
          "Verifikasi gagal. Tautan mungkin sudah kadaluarsa atau tidak valid."
        );
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 card-shadow text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h1 className="mb-2 text-2xl font-bold text-foreground">Verifikasi Email</h1>
          
          <div className="mt-8">
            {status === "loading" && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Sedang memproses verifikasi akun Anda...</p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-green-500/10 p-3">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <p className="text-foreground font-medium">{message}</p>
                <p className="text-sm text-muted-foreground">Sekarang Anda dapat masuk dan mulai melamar pekerjaan.</p>
                <Link to="/login" className="mt-4 w-full">
                  <Button className="w-full">Masuk Sekarang <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-destructive/10 p-3">
                  <XCircle className="h-10 w-10 text-destructive" />
                </div>
                <p className="text-muted-foreground">{message}</p>
                <div className="mt-6 flex w-full flex-col gap-2">
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full">Ke Halaman Login</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyEmail;