import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext.jsx";
import { API } from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  User,
  Mail,
  Phone,
  Shield,
  Store,
  LogOut,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const SELLER_STATUS_CONFIG = {
  NONE: {
    label: "Not Applied",
    icon: User,
    badgeClass: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  },
  PENDING: {
    label: "Pending Review",
    icon: Clock,
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  REJECTED: {
    label: "Rejected",
    icon: AlertCircle,
    badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
};

function ProfileField({ icon: Icon, label, value, breakAll = false }) {

  return (
    <div className="group relative rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-all duration-300 hover:border-sky-400/30 hover:bg-white/[0.06]">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 ring-1 ring-white/10">
          <Icon className="h-5 w-5 text-sky-400" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          {label}
        </p>
      </div>
      <p
        className={`text-lg font-semibold text-white ${breakAll ? "break-all" : ""
          }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function SellerRequestModal({ isOpen, onClose, onSubmit, formData, setFormData }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-indigo-950/95 p-8 shadow-[0_40px_100px_rgba(0,0,0,0.7)] backdrop-blur-xl relative overflow-hidden animate-in zoom-in-95 fade-in duration-500">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-sky-500/20 to-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-purple-500/15 to-pink-500/15 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-white via-sky-200 to-indigo-200 bg-clip-text text-transparent">Seller Application</h2>
            <p className="mt-2 text-sm text-slate-400 font-medium">
              Apply to become a seller on our platform
            </p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full p-2.5 text-slate-500 hover:bg-white/10 hover:text-white transition-all duration-300 hover:rotate-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sellerType" className="text-sm font-semibold text-slate-200 flex items-center gap-1">
              Seller Type <span className="text-sky-400">*</span>
            </Label>
            <Select value={formData.sellerType} onValueChange={(value) => setFormData({ ...formData, sellerType: value })}>
              <SelectTrigger id="sellerType" className="cursor-pointer w-full rounded-2xl border border-white/10 bg-slate-800/40 px-5 py-3.5 text-white outline-none transition-all duration-300 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/30 h-auto">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-2xl shadow-black/50 p-1">
                <SelectGroup>
                  <SelectItem value="Individual" className="cursor-pointer">
                    Individual Seller
                  </SelectItem>
                  <SelectItem value="Business" className="cursor-pointer">
                    Business Seller
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellingCategory" className="text-sm font-semibold text-slate-200 flex items-center gap-1">
              Selling Category <span className="text-sky-400">*</span>
            </Label>
            <Select value={formData.sellingCategory} onValueChange={(value) => setFormData({ ...formData, sellingCategory: value })}>
              <SelectTrigger id="sellingCategory" className="cursor-pointer w-full rounded-2xl border border-white/10 bg-slate-800/40 px-5 py-3.5 text-white outline-none transition-all duration-300 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/30 h-auto">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-2xl shadow-black/50 p-1 max-h-60">
                <SelectGroup>
                  {[
                    { value: "Electronics", label: "Electronics" },
                    { value: "Fashion", label: "Fashion" },
                    { value: "Home", label: "Home & Garden" },
                    { value: "Sports", label: "Sports & Outdoors" },
                    { value: "Jewellery", label: "Jewellery & Accessories" },
                    { value: "Books", label: "Books & Media" },
                    { value: "Toys", label: "Toys & Games" },
                  ].map((item) => (
                    <SelectItem key={item.value} value={item.value} className="cursor-pointer">
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellerReason" className="text-sm font-semibold text-slate-200 flex items-center gap-1">
              Why do you want to sell? <span className="text-sky-400">*</span>
            </Label>
            <Textarea
              id="sellerReason"
              placeholder="Tell us about your selling goals and experience..."
              value={formData.sellerReason}
              onChange={(e) =>
                setFormData({ ...formData, sellerReason: e.target.value })
              }
              className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-slate-800/40 px-5 py-3.5 text-white outline-none transition-all duration-300 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/30 focus:bg-slate-800/60 resize-none placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="relative z-10 mt-8 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer flex-1 rounded-2xl border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white font-medium py-3 transition-all duration-300"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            className="cursor-pointer flex-1 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 font-semibold text-white shadow-lg shadow-sky-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/40 hover:scale-[1.02] py-3"
          >
            Submit Application
          </Button>
        </div>
      </div>
    </div>
  );
}

function Profile() {
  const [userData, setUserData] = useState(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showSellerForm, setShowSellerForm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [sellerForm, setSellerForm] = useState({
    sellerType: "",
    sellingCategory: "",
    sellerReason: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await API.get("/me");
      setUserData(res.data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load profile");
    }
  }

  async function refreshProfile() {
    setIsRefreshing(true);

    await fetchProfile();

    toast.success("Profile refreshed ✨");

    setTimeout(() => setIsRefreshing(false), 500);
  }

  async function requestSeller() {
    try {
      if (
        !sellerForm.sellerType ||
        !sellerForm.sellingCategory ||
        !sellerForm.sellerReason.trim()
      ) {
        toast.error("All fields are required");
        return;
      }

      if (sellerForm.sellerReason.trim().length < 20) {
        toast.error("Reason must be at least 20 characters");
        return;
      }
      const res = await API.post("/request-seller", sellerForm);
      setShowSellerForm(false);
      setSellerForm({
        sellerType: "",
        sellingCategory: "",
        sellerReason: "",
      });
      fetchProfile();
      toast.success("Seller Request Submitted 🚀");
    } catch (e) {
      toast.error("Request Failed");
      return;
    }
  }

  async function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  if (!userData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="relative mx-auto h-16 w-16">
            <div className="absolute inset-0 rounded-full border-2 border-sky-400/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-sky-400 animate-spin" />
          </div>
          <p className="text-sm font-medium text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const statusConfig =
    SELLER_STATUS_CONFIG[userData.sellerRequest] ||
    SELLER_STATUS_CONFIG.NONE;
  const StatusIcon = statusConfig.icon;

  const canApplySeller =
    userData.role !== "seller" &&
    userData.role !== "admin" &&
    userData.sellerRequest === "NONE";

  return (
    <>
      <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in duration-700">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 md:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-sky-300 backdrop-blur-xl">
              <User className="h-3 w-3 text-sky-400" />
              Account Settings
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
              Profile
              <span className="block text-lg font-medium text-slate-400 md:text-xl">
                Manage your account and seller preferences
              </span>
            </h1>
          </div>
        </section>

        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          {/* Left Column - Personal Information */}
          <div className="h-full">
            {/* Profile Card */}
            <Card className="h-full rounded-[1.75rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg shadow-sky-500/25">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex h-full flex-col justify-center">
                <div className="grid gap-5 sm:grid-cols-2">
                  <ProfileField
                    icon={User}
                    label="Full Name"
                    value={userData.name}
                  />
                  <ProfileField
                    icon={Mail}
                    label="Email Address"
                    value={userData.email}
                    breakAll
                  />
                  <ProfileField
                    icon={Phone}
                    label="Phone Number"
                    value={userData.phone || "Not provided"}
                  />
                  <ProfileField
                    icon={Shield}
                    label="Account Role"
                    value={userData.role?.toUpperCase()}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Account Actions & Seller Access */}
          <div className="flex h-full flex-col gap-6">
            {/* Account Actions */}
            <Card className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/20 to-red-500/20 ring-1 ring-rose-400/30">
                    <LogOut className="h-6 w-6 text-rose-400" />
                  </div>
                  <span className="text-xl font-bold text-white">Account Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="cursor-pointer w-full justify-start gap-3 rounded-2xl border-rose-400/30 bg-rose-500/10 px-4 py-6 text-sm font-semibold text-rose-300 hover:bg-rose-500/20 hover:text-rose-200"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
                <Button
                  onClick={refreshProfile}
                  variant="outline"
                  disabled={isRefreshing}
                  className="cursor-pointer w-full justify-start gap-3 rounded-2xl border-white/10 bg-white/5 px-4 py-6 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh Data
                </Button>
              </CardContent>
            </Card>

            {/* Seller Status Section */}
            <Card className="flex flex-col flex-1 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 ring-1 ring-emerald-400/30">
                    <Store className="h-6 w-6 text-emerald-400" />
                  </div>
                  <span className="text-xl font-bold text-white">Seller Access</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-5">
                {userData.role !== "admin" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Current Status
                      </p>
                      <Badge
                        className={`border px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusConfig.badgeClass}`}
                      >
                        <StatusIcon className="mr-1.5 h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    </div>

                    {userData.sellerRequest === "PENDING" && (
                      <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4">
                        <p className="text-sm text-amber-300">
                          Your seller application is being reviewed. This typically takes 1-2 business days.
                        </p>
                      </div>
                    )}

                    {userData.sellerRequest === "APPROVED" && (
                      <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4">
                        <p className="text-sm text-emerald-300">
                          Congratulations! You now have seller privileges. Start creating auctions from your dashboard.
                        </p>
                      </div>
                    )}

                    {userData.sellerRequest === "REJECTED" && (
                      <div className="rounded-2xl border border-rose-400/20 bg-gradient-to-br from-rose-500/10 to-red-500/10 p-4">
                        <p className="mb-3 text-sm text-rose-300">
                          Your application was not approved. You can reapply with additional information.
                        </p>
                        <Button
                          onClick={() => setShowSellerForm(true)}
                          size="sm"
                          className="cursor-pointer rounded-xl bg-gradient-to-r from-rose-500 to-red-600 font-semibold text-white shadow-lg shadow-rose-500/20 transition-all duration-300 hover:shadow-rose-500/40"
                        >
                          Reapply Now
                        </Button>
                      </div>
                    )}

                    {canApplySeller && (
                      <Button
                        onClick={() => setShowSellerForm(true)}
                        className="cursor-pointer w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 font-semibold text-white shadow-lg shadow-sky-500/20 transition-all duration-300 hover:shadow-sky-500/40"
                      >
                        Request Seller Access
                      </Button>
                    )}
                  </div>
                )}

                {userData.role === "admin" && (
                  <div className="rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 p-4">
                    <p className="text-sm text-sky-300">
                      You have administrator privileges with full platform access.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SellerRequestModal
        isOpen={showSellerForm}
        onClose={() => setShowSellerForm(false)}
        onSubmit={requestSeller}
        formData={sellerForm}
        setFormData={setSellerForm}
      />
    </>
  );
}

export { Profile };