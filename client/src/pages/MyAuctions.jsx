import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
    Search,
    MoreVertical,
    Copy,
    PauseCircle,
    PlayCircle,
    Calendar,
    Users,
    ExternalLink,
    Package,
} from "lucide-react";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
    LIVE: {
        label: "Live",
        icon: PlayCircle,
        badgeClass:
            "relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white border border-emerald-300/40 backdrop-blur-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/35 hover:border-emerald-200/50",
        bgGlow: "from-emerald-500/20 to-teal-500/10",
    },

    UPCOMING: {
        label: "Upcoming",
        icon: Calendar,
        badgeClass:
            "relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white border border-amber-300/40 backdrop-blur-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-400/35 hover:border-amber-200/50",
        bgGlow: "from-amber-500/20 to-orange-500/10",
    },

    ENDED: {
        label: "Ended",
        icon: PauseCircle,
        badgeClass:
            "relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 text-white border border-slate-300/40 backdrop-blur-xl shadow-lg shadow-slate-500/25 hover:shadow-slate-400/35 hover:border-slate-200/50",
        bgGlow: "from-slate-500/15 to-zinc-600/10",
    },

    PAID: {
        label: "Paid",
        icon: Users,
        badgeClass:
            "relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 text-white border border-sky-300/40 backdrop-blur-xl shadow-lg shadow-sky-500/25 hover:shadow-sky-400/35 hover:border-sky-200/50",
        bgGlow: "from-sky-500/20 to-blue-600/10",
    },
};

function getStatusConfig(status) {
    return STATUS_CONFIG[status] || STATUS_CONFIG.ENDED;
}

function MyAuctions() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const navigate = useNavigate();

    useEffect(() => {
        fetchAuctions();

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);

    async function fetchAuctions() {
        setLoading(true);
        try {
            const res = await API.get("/my-auctions");
            setAuctions(res.data);
        } catch (e) {
            toast.error("Failed to load auctions");
        } finally {
            setLoading(false);
        }
    }

    const statusOrder = {
        LIVE: 0,
        UPCOMING: 1,
        ENDED: 2,
        PAID: 3,
    };

    const filteredAuctions = auctions
        .filter((auction) => {

            const matchesSearch =
                auction.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                auction.description?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter =
                filterStatus === "ALL" ||
                auction.status === filterStatus;

            return matchesSearch && matchesFilter;
        })

        // ✅ STATUS ORDER SORTING
        .sort((a, b) => {

            return (
                statusOrder[a.status] -
                statusOrder[b.status]
            );
        });

    const stats = {
        total: auctions.length,
        live: auctions.filter(a => a.status === "LIVE").length,
        upcoming: auctions.filter(a => a.status === "UPCOMING").length,
        ended: auctions.filter(a => a.status === "ENDED").length,
        paid: auctions.filter(a => a.status === "PAID").length,
        totalBids: auctions.reduce((sum, a) => sum + (a.bidCount || 0), 0),
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-sky-950 p-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-32 bg-white/10" />
                            <Skeleton className="h-10 w-48 bg-white/10" />
                            <Skeleton className="h-4 w-64 bg-white/10" />
                        </div>
                        <Skeleton className="h-20 w-32 rounded-2xl bg-white/10" />
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-2xl bg-white/5" />
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-96 rounded-3xl bg-white/5" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-sky-950 p-8 text-white shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300/80">
                            Seller Center
                        </p>
                        <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                            My Auctions
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm text-slate-300">
                            Manage your created listings, track active bids, and review ended auctions.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 backdrop-blur">
                        <p className="text-xs uppercase tracking-wider text-slate-400">Total Listings</p>
                        <p className="text-2xl font-black text-white">{stats.total}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                {[
                    { label: "Live", value: stats.live, icon: PlayCircle, color: "text-emerald-400" },
                    { label: "Upcoming", value: stats.upcoming, icon: Calendar, color: "text-amber-400" },
                    { label: "Ended", value: stats.ended, icon: PauseCircle, color: "text-slate-400" },
                    { label: "Paid", value: stats.paid, icon: PauseCircle, color: "text-sky-400" },
                    { label: "Total Bids", value: stats.totalBids, icon: Users, color: "text-indigo-400" },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:border-white/20">
                        <stat.icon className={`h-5 w-5 mb-2 ${stat.color}`} />
                        <p className="text-2xl font-black text-white">{stat.value.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search auctions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-sky-400/30 focus-visible:border-sky-400/30"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["ALL", "LIVE", "UPCOMING", "ENDED", "PAID"].map((status) => (
                        <Button
                            key={status}
                            variant={filterStatus === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterStatus(status)}
                            className={filterStatus === status
                                ? "cursor-pointer rounded-2xl transition-all duration-300 backdrop-blur-xl bg-gradient-to-r from-sky-500/25 via-sky-400/20 to-indigo-500/25 text-sky-200 border border-sky-400/40 shadow-[0_0_24px_rgba(56,189,248,0.3)] ring-1 ring-sky-400/30 hover:from-sky-500/35 hover:via-sky-400/30 hover:to-indigo-500/35 hover:text-sky-100 hover:border-sky-400/60 hover:shadow-[0_0_32px_rgba(56,189,248,0.45)] hover:ring-sky-400/50 hover:-translate-y-0.5 active:scale-[0.97]"
                                : "cursor-pointer rounded-2xl transition-all duration-300 backdrop-blur-md border-white/15 bg-white/[0.04] text-slate-300 hover:bg-white/12 hover:text-slate-100 hover:border-white/30 hover:shadow-[0_0_18px_rgba(255,255,255,0.08)] hover:ring-1 hover:ring-white/10 hover:-translate-y-0.5"
                            }
                        >
                            {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
                        </Button>
                    ))}
                </div>
            </div>

            {filteredAuctions.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-20 text-center backdrop-blur-xl">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20">
                        <Package className="h-10 w-10 text-sky-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                        {searchQuery || filterStatus !== "ALL" ? "No auctions found" : "No auctions created yet"}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-slate-400">
                        {searchQuery || filterStatus !== "ALL"
                            ? "Try adjusting your search or filter criteria"
                            : "You haven't listed any items. Create a new auction to start selling!"
                        }
                    </p>
                    {!searchQuery && filterStatus === "ALL" && (
                        <Button
                            onClick={() => navigate("/dashboard/create")}
                            className="cursor-pointer relative overflow-hidden bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 hover:ring-2 hover:ring-indigo-400/50 hover:scale-[1.03] active:scale-[0.97]"
                        >
                            Create Your First Auction
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredAuctions.map((auction) => {
                        const priceLabelMap = {
                            LIVE: "Current Price",
                            UPCOMING: "Starting Price",
                            ENDED: "Winning Bid",
                            PAID: "Sold For",
                        };

                        const winnerLabel =
                            auction.status === "PAID"
                                ? "Sold To"
                                : "Winner";

                        const priceLabel =
                            priceLabelMap[auction.status] || "Price";

                        const isCompleted =
                            auction.status === "ENDED" ||
                            auction.status === "PAID";

                        return (
                            <Card
                                key={auction._id}
                                className="group/card relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl transition-all duration-700 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)]"
                            >
                                {/* multi-layer ambient glow */}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.03] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
                                {(() => {
                                    const config = getStatusConfig(auction.status);
                                    return (
                                        <div className={`pointer-events-none absolute -inset-2 bg-gradient-to-br ${config.bgGlow} opacity-0 blur-2xl group-hover/card:opacity-60 transition-opacity duration-700`} />
                                    );
                                })()}

                                {/* subtle grid pattern overlay */}
                                <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:24px_24px]" />

                                <div className="relative">
                                    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-black/30">
                                        <img
                                            src={auction.image}
                                            alt={auction.title}
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "https://placehold.co/600x400?text=Auction";
                                            }}
                                            className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover/card:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                                        {/* premium shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 translate-x-[-100%] group-hover/card:translate-x-[100%] group-hover/card:opacity-100 transition-all duration-1000 ease-out" />

                                        {/* status badge */}
                                        <div className="absolute top-3 right-3 z-10">
                                            {(() => {
                                                const config = getStatusConfig(auction.status);
                                                const Icon = config.icon;

                                                return (
                                                    <Badge className={config.badgeClass}>
                                                        <Icon className="mr-1 h-3 w-3" />
                                                        {config.label}
                                                    </Badge>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    <CardContent className="p-5">
                                        <div className="mb-3 flex items-start justify-between gap-2">
                                            <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-bold text-white transition-all duration-300 group-hover/card:text-sky-300">
                                                {auction.title}
                                            </h3>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild aria-label="Auction actions">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 cursor-pointer rounded-lg text-slate-400 opacity-100 transition-opacity hover:bg-white/10 hover:text-white sm:opacity-0 sm:group-hover/card:opacity-100"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-48 border-white/10 bg-slate-900/95 backdrop-blur-xl"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={async () => {
                                                            try {
                                                                await navigator.clipboard.writeText(
                                                                    `${window.location.origin}/auction/${auction._id}`
                                                                );

                                                                toast.success("Auction link copied 🔗");
                                                            } catch {
                                                                toast.error("Failed to copy link");
                                                            }
                                                        }}
                                                        className="cursor-pointer text-slate-300 focus:bg-white/10 focus:text-white"
                                                    >
                                                        <Copy className="mr-2 h-4 w-4" />
                                                        Copy Link
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-400">
                                            {auction.description}
                                        </p>

                                        <div className="mb-4 grid grid-cols-2 gap-3 rounded-2xl border border-white/5 bg-slate-900/50 p-3">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                                    {priceLabel}
                                                </p>

                                                <p className="mt-0.5 text-lg font-black tabular-nums text-white">
                                                    ₹{auction.currentPrice?.toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                                    Total Bids
                                                </p>

                                                <p className="mt-0.5 text-lg font-black text-sky-400">
                                                    {auction.bidCount?.toLocaleString() || "0"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="border-t border-white/[0.06] pt-4">
                                            {isCompleted ? (
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs font-medium text-emerald-400">
                                                            {winnerLabel}
                                                        </p>

                                                        <p className="text-sm font-bold text-white">
                                                            {auction.winnerId?.name || "None"}
                                                        </p>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            navigate(`/auction/${auction._id}`)
                                                        }
                                                        className="group cursor-pointer rounded-lg h-8 px-3 text-[11px] font-bold uppercase tracking-wider text-sky-400 hover:bg-white/10 hover:text-sky-300 transition-all group-hover/card:shadow-[0_4px_16px_rgba(56,189,248,0.25)]"
                                                    >
                                                        <ExternalLink className="mr-1.5 h-3.5 w-3.5 transition-transform group-hover/card:translate-x-0.5" />
                                                        View
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs font-medium text-slate-400">
                                                            {auction.status === "UPCOMING"
                                                                ? "Starts"
                                                                : "Ends"}
                                                        </p>

                                                        <p className="text-sm font-bold text-sky-400">
                                                            {auction.status === "UPCOMING"
                                                                ? new Date(
                                                                    auction.startTime
                                                                ).toLocaleDateString()
                                                                : new Date(
                                                                    auction.endTime
                                                                ).toLocaleDateString()}
                                                        </p>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            navigate(`/auction/${auction._id}`)
                                                        }
                                                        className="group cursor-pointer rounded-lg h-8 px-3 text-[11px] font-bold uppercase tracking-wider text-sky-400 hover:bg-white/10 hover:text-sky-300 transition-all group-hover/card:shadow-[0_4px_16px_rgba(56,189,248,0.25)]"
                                                    >
                                                        <ExternalLink className="mr-1.5 h-3.5 w-3.5 transition-transform group-hover/card:translate-x-0.5" />
                                                        View
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export { MyAuctions };