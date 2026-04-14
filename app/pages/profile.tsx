import { useState } from "react";
import { Camera, Save } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";
import { toast } from "sonner";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+62 812 3456 7890",
    dob: "1995-06-15",
    gender: "male",
    education: "bachelor",
    address: "Jl. Sudirman No. 1, Jakarta Selatan, DKI Jakarta 12190",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated! (UI only)");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-10">
        <h1 className="mb-8 text-2xl font-bold text-foreground">My Profile</h1>

        <div className="mb-8 flex items-center gap-6">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl text-primary-foreground font-bold">
              {profile.name.charAt(0)}
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 rounded-xl border border-border bg-card p-6 card-shadow">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" value={profile.dob} onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={profile.gender} onValueChange={(v) => setProfile({ ...profile, gender: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Last Education</Label>
              <Select value={profile.education} onValueChange={(v) => setProfile({ ...profile, education: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high_school">High School</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="doctorate">Doctorate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Latest Address</Label>
            <Textarea value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Change Password</Label>
            <Input type="password" placeholder="New password (leave blank to keep current)" />
          </div>

          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
