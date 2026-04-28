import { useState, useEffect, useRef } from "react";
import { Camera, Save, Loader2, KeyRound, Briefcase, Calendar, Download } from "lucide-react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";
import { toast } from "sonner";
import { useAuth, type UserAuth } from "~/stores/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { updateProfileSchema, type UpdateProfileSchema } from "~/schema/user"; // Import skema baru
import { Badge } from "~/components/ui/badge";
import type { ApplicationCV } from "~/types/application";

// Interface untuk tipe data dari API agar tidak menggunakan 'any'
interface UserProfile {
  fullName: string;
  email: string;
  profilePhoto?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  education?: "high_school" | "diploma" | "bachelor" | "master" | "doctorate";
  address?: string;
  city?: string;
  company?: {
    companyName: string;
    phone?: string;
  };
}

interface AppliedJob {
  id: number;
  status: string;
  createdAt: string;
  job: {
    title: string;
    company: { companyName: string };
  };
  interview?: {
    id: number;
    interviewDate: string;
    locationLink?: string | null;
  };
}

const Profile = () => {
  const { user: authUser, login: updateAuthStore } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvFileInputRef = useRef<HTMLInputElement>(null);
  const [cvName, setCvName] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Menggunakan useForm untuk mengelola state form dan validasi
  const {
    register,
    handleSubmit,
    setValue,
    watch, // Digunakan untuk memantau nilai field tertentu, misal untuk Select
    formState: { errors },
  } = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      dateOfBirth: "",
      gender: "male",
      education: "high_school",
      address: "",
      city: "",
      companyName: "", // Sertakan untuk role ADMIN
    },
  });

  const currentRole = authUser?.role;
  const watchedCompanyName = watch("companyName"); // Memantau companyName untuk conditional validation jika diperlukan

  // Fetch data profil dari BE
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/profile");
      return response.data.data as UserProfile;
    },
  });

  // Update state lokal saat data dari BE tiba
  useEffect(() => {
    if (profileData) {
      const values: UpdateProfileSchema = {
        fullName: profileData.fullName || "",
        phone: profileData.phone || profileData.company?.phone || "",
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : "",
        gender: profileData.gender || "male",
        education: profileData.education || "high_school" as any,
        address: profileData.address || "",
        city: profileData.city || "",
        companyName: profileData.company?.companyName || "", // Pastikan companyName terisi untuk ADMIN
      };
      (Object.keys(values) as Array<keyof UpdateProfileSchema>).forEach((key) => {
        setValue(key, values[key]);
      });
    }
  }, [profileData]);

  // Mutasi untuk menyimpan perubahan
  const updateMutation = useMutation({
    mutationFn: async (updatedData: UpdateProfileSchema) => {
      // Jika /user/profile masih 404, coba ganti menjadi "/user" 
      // atau pastikan di backend sudah ada: router.patch("/profile", ...)
      const payload = { ...updatedData };
      if (!payload.dateOfBirth) delete payload.dateOfBirth;
      
      const response = await axiosInstance.patch("/user/profile", payload);
      return response.data.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      updateAuthStore({ ...(authUser as UserAuth), ...(updatedUser as UserAuth), token: authUser?.token } as UserAuth);
      toast.success("Profil berhasil diperbarui!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  // Mutasi untuk mengunggah foto profil
  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("profilePhoto", file);
      const response = await axiosInstance.patch("/user/profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      // Update store global agar Navbar/Sidebar ikut berubah
      updateAuthStore({ ...(authUser as UserAuth), ...(updatedUser as UserAuth), token: authUser?.token } as UserAuth);
      toast.success("Foto profil berhasil diperbarui!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upload photo");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadPhotoMutation.mutate(file);
  };

  const { data: cvs, isLoading: isCvsLoading } = useQuery({
    queryKey: ["cvs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/cvs");
      return response.data.data as ApplicationCV[];
    },
  });

  const uploadCvMutation = useMutation({
    mutationFn: async ({ name, file }: { name: string; file: File }) => {
      const formData = new FormData();
      formData.append("cvName", name);
      formData.append("cv", file);
      const response = await axiosInstance.post("/cvs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data as ApplicationCV;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cvs"] });
      setCvName("");
      setCvFile(null);
      if (cvFileInputRef.current) cvFileInputRef.current.value = "";
      toast.success("CV berhasil diunggah!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upload CV");
    },
  });

  const setPrimaryCvMutation = useMutation({
    mutationFn: async (cvId: number) => {
      const response = await axiosInstance.patch(`/cvs/${cvId}/primary`);
      return response.data.data as ApplicationCV;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cvs"] });
      toast.success("CV Utama berhasil diperbarui!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update primary CV");
    },
  });

  const deleteCvMutation = useMutation({
    mutationFn: async (cvId: number) => {
      await axiosInstance.delete(`/cvs/${cvId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cvs"] });
      toast.success("CV berhasil dihapus!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete CV");
    },
  });

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error("Gagal mendownload file CV");
    }
  };

  // Fetch data Applied Jobs (Hanya untuk USER)
  const { data: appliedJobs, isLoading: isAppsLoading } = useQuery({
    queryKey: ["applied-jobs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/applications/me", {
        params: { take: 50, page: 1 },
      });
      return response.data.data as AppliedJob[];
    },
    enabled: currentRole === "USER",
  });

  // Derivasi data interview dari appliedJobs untuk sinkronisasi dengan BE
  const interviews = appliedJobs?.filter(
    (app) => 
      app.interview && 
      ["INTERVIEW", "ACCEPTED"].includes(app.status.toUpperCase())
  ).map(app => ({
    ...app.interview,
    jobTitle: app.job.title,
    companyName: app.job.company.companyName
  }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit((data) => updateMutation.mutate(data))();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="hero-gradient py-10">
        <div className="container max-w-2xl">
          <h1 className="text-3xl font-bold text-primary-foreground italic uppercase tracking-tight">
            Profil Saya
          </h1>
        </div>
      </div>

      <div className="container max-w-2xl py-10">
        <div className="mb-8 flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative">
            {profileData?.profilePhoto ? (
              <img src={profileData.profilePhoto} alt={watch("fullName")} className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl text-primary-foreground font-bold uppercase">
                {watch("fullName")?.charAt(0) || "U"}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadPhotoMutation.isPending}
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {uploadPhotoMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{watch("fullName")}</h2>
            <p className="text-sm text-muted-foreground">{authUser?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 rounded-xl border border-border bg-card p-6 card-shadow">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input {...register("fullName")} /> {/* Gunakan register */}
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              {/* Email tidak dapat diedit, ambil dari authUser */}
              <Input type="email" value={authUser?.email || ""} disabled className="bg-muted" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Kota</Label>
              <Input {...register("city")} />
              {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Tanggal Lahir</Label>
              <Input type="date" {...register("dateOfBirth")} />
              {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>}
            </div>
          </div>

          {/* Field khusus untuk role ADMIN */}
          {currentRole === "ADMIN" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nama Perusahaan</Label>
                <Input {...register("companyName")} />
                {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Telepon Perusahaan</Label>
                <Input {...register("phone")} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>
          )}

          {/* Jika phone adalah field umum untuk USER, uncomment blok ini dan hapus dari blok ADMIN di atas */}
          {/* {currentRole === "USER" && (
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input {...register("phone")} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
          )} */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Bagian Gender bisa ditambahkan ke BE jika diperlukan, sementara disesuaikan dengan field yang ada */}
            <div className="space-y-2">
              <Label>Jenis Kelamin</Label>
              <Select 
                value={watch("gender")} 
                onValueChange={(v) => setValue("gender", v)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Laki-laki</SelectItem>
                  <SelectItem value="female">Perempuan</SelectItem>
                  <SelectItem value="other">Lainnya</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-xs text-destructive">{errors.gender.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Pendidikan Terakhir</Label>
              <Select
                value={watch("education") || ""} // Gunakan watch untuk mendapatkan nilai saat ini
                onValueChange={(v) => setValue("education", v as UpdateProfileSchema["education"])} // Gunakan setValue untuk memperbarui
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high_school">SMA/SMK</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="bachelor">Sarjana (S1)</SelectItem>
                  <SelectItem value="master">Magister (S2)</SelectItem>
                  <SelectItem value="doctorate">Doktor (S3)</SelectItem>
                </SelectContent>
              </Select>
              {errors.education && <p className="text-xs text-destructive">{errors.education.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Alamat Terakhir</Label>
            <Textarea {...register("address")} rows={3} />
            {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
          </div>

          <div className="pt-4 border-t border-border">
            <Label className="mb-2 block">Keamanan Akun</Label>
            <p className="mb-4 text-xs text-muted-foreground">
              Untuk mengubah kata sandi, kami akan mengirimkan tautan pengaturan ulang ke email Anda.
            </p>
            <Link to="/forgot-password">
              <Button type="button" variant="outline" size="sm" className="gap-2">
                <KeyRound className="h-4 w-4" /> Ubah Kata Sandi
              </Button>
            </Link>
          </div>

          <Button type="submit" className="gap-2" disabled={updateMutation.isPending || uploadPhotoMutation.isPending}>
            {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>

        <div className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Daftar CV</h2>
              <p className="text-xs text-muted-foreground">Upload CV (PDF) dan pilih CV utama untuk melamar.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nama CV</Label>
              <Input value={cvName} onChange={(e) => setCvName(e.target.value)} placeholder="Contoh: CV - Backend Engineer" />
            </div>
            <div className="space-y-2">
              <Label>Berkas (PDF)</Label>
              <Input
                ref={cvFileInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <Button
            type="button"
            className="gap-2"
            disabled={!cvFile || !cvName.trim() || uploadCvMutation.isPending}
            onClick={() => {
              if (!cvFile) return;
              uploadCvMutation.mutate({ name: cvName.trim(), file: cvFile });
            }}
          >
            {uploadCvMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {uploadCvMutation.isPending ? "Mengunggah..." : "Unggah CV"}
          </Button>

          <div className="pt-2 border-t border-border">
            {isCvsLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Memuat CV...
              </div>
            ) : !cvs || cvs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada CV. Upload CV pertama kamu di atas.</p>
            ) : (
              <div className="space-y-3">
                {cvs.map((cv) => (
                  <div key={cv.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-foreground">{cv.cvName}</p>
                        {cv.isPrimary ? <Badge>Utama</Badge> : null}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{cv.fileUrl}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => window.open(cv.fileUrl, "_blank")}>
                        Lihat
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        title="Download CV"
                        onClick={() => handleDownload(cv.fileUrl, cv.cvName)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={cv.isPrimary || setPrimaryCvMutation.isPending}
                        onClick={() => setPrimaryCvMutation.mutate(cv.id)}
                      >
                        {setPrimaryCvMutation.isPending ? "..." : "Jadikan Utama"}
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={deleteCvMutation.isPending}
                        onClick={() => deleteCvMutation.mutate(cv.id)}
                      >
                        {deleteCvMutation.isPending ? "..." : "Hapus"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {currentRole === "USER" && (
          <>
            {/* Applied Jobs Section */}
            <div className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6 card-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Lamaran Pekerjaan</h2>
              </div>
              {isAppsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Memuat lamaran...
                </div>
              ) : !appliedJobs || appliedJobs.length === 0 ? (
                <p className="text-sm text-muted-foreground">Anda belum melamar pekerjaan apa pun.</p>
              ) : (
                <div className="space-y-3">
                  {appliedJobs.map((app) => (
                    <div key={app.id} className="flex items-center justify-between rounded-lg border border-border p-4 bg-background/50">
                      <div>
                        <h3 className="font-medium text-foreground">{app.job?.title}</h3>
                        <p className="text-sm text-muted-foreground">{app.job?.company?.companyName}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Dilamar pada: {new Date(app.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <Badge variant={
                        app.status === "accepted" ? "default" : 
                        app.status === "rejected" ? "destructive" : 
                        "secondary"
                      } className="uppercase text-[10px]">
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Interviews Section */}
            <div className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6 card-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Undangan Interview</h2>
              </div>
              {isAppsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Memuat undangan...
                </div>
              ) : !interviews || interviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada undangan interview saat ini.</p>
              ) : (
                <div className="space-y-3">
                  {interviews.map((interview) => (
                    <div key={interview?.id} className="rounded-lg border border-border p-4 bg-background/50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-foreground">{interview?.jobTitle}</h3>
                          <p className="text-sm text-muted-foreground">{interview?.companyName}</p>
                        </div>
                      </div>
                      <div className="grid gap-1 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {interview?.interviewDate ? new Date(interview.interviewDate).toLocaleString("id-ID") : "-"}
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link to="/dashboard" className="w-full">
                          <Button size="sm" variant="outline" className="w-full">Lihat di Dashboard</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
