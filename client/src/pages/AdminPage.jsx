import { useEffect, useState } from "react";
import { API } from "../api/axios";
import toast from "react-hot-toast";
import { CheckCheck, Shield, Inbox, Mail, Tag, FileText, X, Check, User } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

function AdminPage() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    async function fetchRequests() {
        const res = await API.get("/seller-requests");
        setRequests(res.data);
    }

    async function approve(userId) {
        await API.patch(`/approve-seller/${userId}`);
        fetchRequests();
        toast.success("Seller Approved ✅");
    }

    async function reject(userId) {
        try {
            await API.patch(`/reject-seller/${userId}`);
            fetchRequests();
            toast.success("Seller Request Rejected");
        } catch (e) {
            toast.error("Failed to reject");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 px-4 py-10 sm:px-6 lg:px-8">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
                <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-600/20 blur-[120px] animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-fuchsia-600/10 blur-[100px] animate-pulse delay-2000" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBiZWdpd209IjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIxIiBmaWxsPSJyZ2JhK25vbmUpIi8+PC9zdmc+')] opacity-5" />
            </div>

            <div className="relative mx-auto max-w-7xl">
                <Card className="overflow-hidden rounded-[28px] border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                    <CardHeader className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-slate-950 via-indigo-950/80 to-cyan-950/80 px-8 py-12 text-white sm:px-12 sm:py-16">
                        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/25 blur-[100px]" />
                        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-[80px]" />
                        <div className="absolute inset-0">
                            <div className="h-full w-full bg-gradient-to-r from-cyan-500/5 via-transparent to-indigo-500/5 animate-gradient-x" />
                        </div>

                        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-400/30 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                                        <Shield className="h-3.5 w-3.5" />
                                        Admin Control
                                    </Badge>
                                </div>
                                <CardTitle className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-white via-cyan-100 to-indigo-200 bg-clip-text text-transparent">
                                    Seller Approval Dashboard
                                </CardTitle>
                                <CardDescription className="mt-4 max-w-2xl text-sm font-medium text-slate-300 sm:text-base tracking-tight">
                                    Marketplace Moderation • Seller Verification Queue
                                </CardDescription>
                            </div>

                            <div>
                                
                                <Card className="group relative overflow-hidden rounded-[20px] border border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-5 backdrop-blur-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/25">
                                                <CheckCheck className="h-4 w-4 text-white" />
                                            </div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Queue Status</p>
                                        </div>
                                        <p className="text-lg font-bold text-white">
                                            {requests.length > 0 ? "Needs Review" : "All Clear"}
                                        </p>
                                        <div className="mt-2 h-1 w-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="px-6 py-10 sm:px-10">
                        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-extrabold tracking-tight text-white">Seller Requests</h2>
                                <p className="mt-1 text-sm text-slate-400">
                                    Approve verified users to let them publish auctions.
                                </p>
                            </div>

                            <Badge variant="outline" className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-5 py-2.5 text-sm font-semibold text-indigo-300">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 animate-ping" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                                </span>
                                {requests.length} request{requests.length === 1 ? "" : "s"} in queue
                            </Badge>
                        </div>

                        {requests.length === 0 ? (
                            <Card className="flex flex-col items-center justify-center rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-cyan-950/20 px-8 py-14 text-center backdrop-blur-xl">
                                <div className="relative flex items-center justify-center">
                                    <div className="absolute h-52 w-52 rounded-full bg-emerald-500/10 blur-[90px]" />
                                    <div className="absolute h-28 w-28 rounded-full border border-emerald-400/20" />
                                    <div className="absolute h-24 w-24 rounded-full border border-emerald-400/30" />
                                    <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-[30px] border border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.35)]">
                                        <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-white/10 to-transparent opacity-60" />
                                        <Inbox
  className="
    relative
    h-11 w-11
    text-emerald-300
    drop-shadow-[0_0_14px_rgba(52,211,153,0.8)]
  "
  strokeWidth={2}
/>
                                    </div>
                                </div>
                                <h3 className="mt-5 text-3xl font-black tracking-tight text-white">No pending requests</h3>
                                <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-slate-400">
                                    Everything is up to date. New seller applications will appear here automatically.
                                </p>
                            </Card>
                        ) : (
                            <div className="grid gap-6 lg:grid-cols-2">
                                {requests.map((user, index) => (
                                    <Card
                                        key={user._id}
                                        className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-7 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(99,102,241,0.3)]"
                                    >
                                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-400" />
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="relative flex items-start justify-between gap-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-500 via-cyan-500 to-emerald-400 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                                                    <Avatar className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-xl font-black uppercase text-white shadow-2xl shadow-indigo-500/40">
                                                        <AvatarFallback className="bg-transparent text-white">{(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400 shadow-md shadow-emerald-400/50 animate-pulse" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
                                                        Applicant {index + 1}
                                                    </p>
                                                    <h3 className="mt-1 text-xl font-extrabold text-white">{user.name}</h3>
                                                    <p className="mt-1 text-sm text-slate-400">Awaiting seller access approval</p>
                                                </div>
                                            </div>

                                            <Badge className="relative rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-amber-600/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-300 shadow-lg shadow-amber-500/20">
                                                Pending
                                            </Badge>
                                        </div>

                                        <Separator className="my-6 bg-white/10" />

                                        <div className="space-y-4 text-sm">
                                            <div className="flex items-center justify-between gap-3 border-b border-white/10 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-slate-400" />
                                                    <span className="font-semibold text-slate-400">Email</span>
                                                </div>
                                                <span className="truncate text-right font-bold text-white">{user.email}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3 border-b border-white/10 py-3">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-slate-400" />
                                                    <span className="font-semibold text-slate-400">Seller Type</span>
                                                </div>
                                                <span className="font-bold text-white">
                                                    {user.sellerType || "N/A"}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between gap-3 border-b border-white/10 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="h-4 w-4 text-slate-400" />
                                                    <span className="font-semibold text-slate-400">Category</span>
                                                </div>
                                                <span className="font-bold text-white">
                                                    {user.sellingCategory || "N/A"}
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-2 border-b border-white/10 py-3">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-slate-400" />
                                                    <span className="font-semibold text-slate-400">Seller Reason</span>
                                                </div>
                                                <div className="relative">

                                                    <p
                                                        className="
    break-all
    whitespace-pre-wrap
    overflow-hidden
    rounded-2xl
    border border-white/[0.05]
    bg-white/[0.03]
    p-4
    text-sm
    leading-relaxed
    text-slate-200
  "
                                                    >
                                                        {user.sellerReason || "No reason provided"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between gap-3 py-3">
                                                <span className="font-semibold text-slate-400">User ID</span>
                                                <span className="max-w-[60%] truncate text-right font-mono text-xs text-slate-400">
                                                    {user._id}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                                            <Button
                                                onClick={() => reject(user._id)}
                                                type="button"
                                                className="
    cursor-pointer
    rounded-[18px]
    border
    border-rose-400/30
    bg-gradient-to-r
    from-rose-500/10
    to-rose-600/10
    px-6
    py-3
    text-sm
    font-bold
    text-rose-300
    transition-all
    duration-300
    hover:scale-[1.03]
    hover:bg-rose-500/20
    hover:text-rose-200
    hover:shadow-lg
    hover:shadow-rose-500/20
    "
                                            >
                                                <X className="mr-2 h-4 w-4" />
                                                Reject
                                            </Button>
                                            <Button
                                                onClick={() => approve(user._id)}
                                                className="group cursor-pointer inline-flex items-center justify-center rounded-[18px] bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-emerald-500/50 relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                                <Check className="mr-2 h-4 w-4" />
                                                Approve Seller
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export { AdminPage };