import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Save, Loader2, Building2, Globe, Phone, MapPin, Briefcase, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";
import { useAuth, type UserAuth } from "~/stores/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import AdminSidebar from "~/components/admin/admin-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { updateProfileSchema, type UpdateProfileSchema } from "~/schema/user";
import { cn } from "~/lib/utils";

type AdminProfileValues = UpdateProfileSchema;

const AdminProfile = () => {
  const { user: authUser, login: updateAuthStore } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdminProfileValues>({
    resolver: zodResolver(updateProfileSchema) as any,
    defaultValues: {
      fullName: "",
      companyName: "",
      phone: "",
      city: "",
      address: "",
      description: "",
      website: "",
      industry: "",
    },
  });

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/profile");
      return response.data.data;
    },
  });

  useEffect(() => {
    if (profileData) {
      const c = profileData.company;
      setValue("fullName", profileData.fullName || "");
      if (c) {
      setValue("companyName", c.companyName || "");
      setValue("phone", c.phone || "");
      setValue("city", profileData.city || "");
      setValue("address", profileData.address || "");
      setValue("description", c.description || "");
      setValue("website", c.website || "");
      setValue("industry", c.industry || "");
      }
    }
  }, [profileData, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (data: AdminProfileValues) => {
      const response = await axiosInstance.patch("/user/profile", data);
      return response.data.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      updateAuthStore({ ...authUser, ...updatedUser, token: authUser?.token } as UserAuth);
      toast.success("Profil perusahaan berhasil diperbarui!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

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
      updateAuthStore({ ...authUser, ...updatedUser, token: authUser?.token } as UserAuth);
      toast.success("Logo perusahaan berhasil diperbarui!");
    },
  });

  const handleSave = (data: AdminProfileValues) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-[#F0F5FB] w-full">
          <AdminSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-[#1D5FAD] border-t-transparent rounded-full animate-spin" />
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F0F5FB] w-full">
        <AdminSidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-10 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-2">
                  <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none">
                    <rect width="20" height="20" rx="5" fill="#1D5FAD" />
                    <circle cx="8" cy="8" r="3" stroke="white" strokeWidth="1.5" />
                    <path d="M8 11v4M5 15h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M13 7h4M13 10h3M13 13h3.5" stroke="#7DD3FC" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">
                    Admin Profile
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-[#0F2342]">Profil Perusahaan</h1>
                <p className="text-slate-500 text-sm mt-1">Kelola identitas publik dan informasi perusahaan Anda.</p>
              </div>

              <div className="flex flex-col gap-8 lg:flex-row">
                {/* Left Side: Logo */}
                <div className="w-full lg:w-1/3">
                  <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
                    <CardContent className="flex flex-col items-center py-10">
                      <div className="relative mb-6">
                        <div className="h-32 w-32 overflow-hidden rounded-3xl border-2 border-dashed border-[#C8D9EE] bg-[#F4F8FF] flex items-center justify-center group-hover:border-[#A5C0E4] transition-all">
                          {profileData?.profilePhoto ? (
                            <img src={profileData.profilePhoto} alt="Logo" className="h-full w-full object-cover" />
                          ) : (
                            <Building2 className="h-12 w-12 text-[#1D5FAD]/40" />
                          )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadPhotoMutation.mutate(e.target.files[0])} />
                        <Button 
                          size="icon" 
                          className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full shadow-lg bg-[#1D5FAD] hover:bg-[#174E8F] text-white" 
                          onClick={() => fileInputRef.current?.click()} 
                          disabled={uploadPhotoMutation.isPending}
                        >
                          {uploadPhotoMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="text-center space-y-1">
                        <h3 className="text-lg font-bold text-[#0F2342]">{watch("companyName") || "Nama Perusahaan"}</h3>
                        <p className="text-xs font-semibold text-slate-400 tracking-widest uppercase">{authUser?.role}</p>
                        <p className="text-[11px] font-medium text-slate-400">{authUser?.email}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Side: Form */}
                <div className="flex-1">
                  <form onSubmit={handleSubmit(handleSave)} className="space-y-8 pb-20">
                    <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
                      <CardHeader className="border-b border-[#E2EAF4] bg-[#F4F8FF]">
                        <CardTitle className="flex items-center gap-3 text-[#0F2342] font-bold text-base">
                          <FileText className="h-4 w-4 text-[#1D5FAD]" />
                          Informasi Umum
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Nama Lengkap Admin</Label>
                          <Input {...register("fullName")} placeholder="Masukkan nama Anda" className="h-12 rounded-xl border-[#D1DFF0] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD] font-medium" />
                          {errors.fullName && <p className="text-xs text-destructive">{(errors.fullName as any).message}</p>}
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Nama Perusahaan</Label>
                            <div className="relative">
                              <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1D5FAD]" />
                              <Input {...register("companyName")} placeholder="Contoh: Acme Inc." className="pl-12 h-12 rounded-xl border-[#D1DFF0] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD] font-medium" />
                            </div>
                            {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Industri</Label>
                            <div className="relative">
                              <Briefcase className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1D5FAD]" />
                              <Input {...register("industry")} placeholder="Contoh: Teknologi" className="pl-12 h-12 rounded-xl border-[#D1DFF0] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD] font-medium" />
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Website</Label>
                            <div className="relative">
                              <Globe className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1D5FAD]" />
                              <Input {...register("website")} placeholder="https://perusahaan.com" className="pl-12 h-12 rounded-xl border-[#D1DFF0] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD] font-medium" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Telepon Perusahaan</Label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1D5FAD]" />
                              <Input {...register("phone")} placeholder="+62..." className="pl-12 h-12 rounded-xl border-[#D1DFF0] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD] font-medium" />
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Kota</Label>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1D5FAD]" />
                              <Input {...register("city")} placeholder="Contoh: Jakarta" className="pl-12 h-12 rounded-xl border-[#D1DFF0] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD] font-medium" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Alamat Lengkap</Label>
                            <Input {...register("address")} placeholder="Alamat lengkap perusahaan" className="h-12 rounded-xl border-[#D1DFF0] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD] font-medium" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
                      <CardHeader className="border-b border-[#E2EAF4] bg-[#F4F8FF]">
                        <CardTitle className="flex items-center gap-3 text-[#0F2342] font-bold text-base">
                          <FileText className="h-4 w-4 text-[#1D5FAD]" />
                          Deskripsi Perusahaan
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Tentang Perusahaan</Label>
                          <Textarea
                            {...register("description")}
                            placeholder="Jelaskan apa yang membuat perusahaan Anda tempat kerja yang luar biasa..."
                            className="min-h-[200px] rounded-xl border-[#D1DFF0] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD] font-medium"
                          />
                          {errors.description && <p className="text-xs text-destructive">{(errors.description as any).message}</p>}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end">
                      <Button type="submit" className="bg-[#1D5FAD] hover:bg-[#174E8F] text-white rounded-xl h-14 px-10 shadow-lg shadow-[#1D5FAD]/20 transition-all active:scale-95 font-semibold text-sm" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Menyimpan...
                          </div>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Simpan Perubahan
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminProfile;