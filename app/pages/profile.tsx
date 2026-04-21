import { useState, useEffect, useRef } from "react";
import { Camera, Save, Loader2, KeyRound } from "lucide-react";
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

const Profile = () => {
  const { user: authUser, login: updateAuthStore } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      return response.data.data;
    },
  });

  // Update state lokal saat data dari BE tiba
  useEffect(() => {
    if (profileData) {
      const values = {
        fullName: profileData.fullName || "",
        phone: profileData.phone || profileData.company?.phone || "",
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : "",
        gender: profileData.gender || "male",
        education: profileData.education || "",
        address: profileData.address || "",
        city: profileData.city || "",
      };
      Object.entries(values).forEach(([key, value]) => setValue(key as any, value));
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
      updateAuthStore(updatedUser as UserAuth);
      toast.success("Profile updated successfully!");
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
      updateAuthStore(updatedUser);
      toast.success("Profile picture updated!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upload photo");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadPhotoMutation.mutate(file);
  };

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
      <div className="container max-w-2xl py-10">
        <h1 className="mb-8 text-2xl font-bold text-foreground">My Profile</h1>

        <div className="mb-8 flex items-center gap-6">
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
              <Label>Full Name</Label>
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
              <Label>City</Label>
              <Input {...register("city")} />
              {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" {...register("dateOfBirth")} />
              {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>}
            </div>
          </div>

          {/* Field khusus untuk role ADMIN */}
          {currentRole === "ADMIN" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input {...register("companyName")} />
                {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Company Phone</Label>
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
              <Label>Gender</Label>
              <Select 
                value={watch("gender")} 
                onValueChange={(v) => setValue("gender", v)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-xs text-destructive">{errors.gender.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Last Education</Label>
              <Select
                value={watch("education") || ""} // Gunakan watch untuk mendapatkan nilai saat ini
                onValueChange={(v) => setValue("education", v as UpdateProfileSchema["education"])} // Gunakan setValue untuk memperbarui
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high_school">High School</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="doctorate">Doctorate</SelectItem>
                </SelectContent>
              </Select>
              {errors.education && <p className="text-xs text-destructive">{errors.education.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Latest Address</Label>
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
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
