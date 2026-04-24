import { useState, useEffect, useRef } from "react";
import { Camera, Save, Loader2, Building2, Globe, Phone, MapPin, Briefcase } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import AdminLayout from "~/components/admin/admin-layout";
import { updateProfileSchema, type UpdateProfileSchema } from "~/schema/user";

type AdminProfileValues = UpdateProfileSchema & {
  description: string;
  website: string;
  industry: string;
};

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
    if (profileData?.company) {
      const c = profileData.company;
      setValue("companyName", c.companyName || "");
      setValue("phone", c.phone || "");
      setValue("city", profileData.city || "");
      setValue("address", profileData.address || "");
      setValue("description", c.description || "");
      setValue("website", c.website || "");
      setValue("industry", c.industry || "");
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
      toast.success("Company profile updated successfully!");
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
      toast.success("Company logo updated!");
    },
  });

  const handleSave = (data: AdminProfileValues) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-100 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Company Profile</h1>
          <p className="text-muted-foreground">Manage your company's public identity and information</p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <Card className="card-shadow border-none">
              <CardContent className="flex flex-col items-center py-8">
                <div className="relative mb-6">
                  <div className="h-32 w-32 overflow-hidden rounded-3xl border-2 border-dashed border-border bg-muted flex items-center justify-center group">
                    {profileData?.profilePhoto ? (
                      <img src={profileData.profilePhoto} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="h-12 w-12 text-muted-foreground/40" />
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadPhotoMutation.mutate(e.target.files[0])} />
                  <Button size="icon" className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full shadow-lg" onClick={() => fileInputRef.current?.click()} disabled={uploadPhotoMutation.isPending}>
                    {uploadPhotoMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-foreground">{watch("companyName") || "Company Name"}</h3>
                  <p className="text-xs font-medium text-muted-foreground">{authUser?.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 space-y-6">
            <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
              <Card className="card-shadow border-none">
                <CardHeader>
                  <CardTitle className="text-lg">General Information</CardTitle>
                  <CardDescription>Update your company's essential contact and location details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input {...register("companyName")} placeholder="Acme Inc." className="rounded-xl" />
                      {errors.companyName && <p className="text-xs text-destructive">{(errors.companyName as any).message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Industry</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input {...register("industry")} placeholder="e.g. Technology" className="pl-10 rounded-xl" />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input {...register("website")} placeholder="https://company.com" className="pl-10 rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Company Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input {...register("phone")} placeholder="+62..." className="pl-10 rounded-xl" />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input {...register("city")} placeholder="Jakarta" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input {...register("address")} placeholder="Full address" className="rounded-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-shadow border-none">
                <CardHeader>
                  <CardTitle className="text-lg">Company Description</CardTitle>
                  <CardDescription>Tell applicants what makes your company a great place to work</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Textarea
                      {...register("description")}
                      placeholder="Tell applicants what makes your company a great place to work..."
                      className="min-h-50 rounded-xl"
                    />
                    {errors.description && <p className="text-xs text-destructive">{(errors.description as any).message}</p>}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" size="lg" className="rounded-2xl px-8 font-bold gap-2" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;