import { useEffect, useState, useMemo } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Search,
  ArrowUpDown,
  IndianRupee,
  Clock,
  Gavel,
  TrendingUp,
  Users,
  Flame,
  PlayCircle,
  PauseCircle,
  Calendar,
  CheckCircle2,
  Zap,
  PlusCircle,
  X,
  Grid3X3,
  List,
} from "lucide-react";
import toast from "react-hot-toast";

function AuctionCardSkeleton() {
  return (
    <Card className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
        <div className="mt-4 flex items-end justify-between border-t border-white/[0.05] pt-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-7 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-9 w-20 rounded-xl" />
        </div>
      </div>
    </Card>
  );
}

const STATUS_CONFIG = {
  LIVE: {
    label: "Live",
    icon: PlayCircle,
    badgeClass:
      "relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white border border-emerald-300/40 backdrop-blur-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/35 hover:border-emerald-200/50 hover:ring-2 hover:ring-emerald-400/50",
    dotClass: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]",
    glow: "from-emerald-500/20 to-teal-500/10",
  },
  UPCOMING: {
    label: "Upcoming",
    icon: Calendar,
    badgeClass:
      "relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white border border-amber-300/40 backdrop-blur-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-400/35 hover:border-amber-200/50 hover:ring-2 hover:ring-amber-400/50",
    dotClass: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]",
    glow: "from-amber-500/20 to-orange-500/10",
  },
  ENDED: {
    label: "Ended",
    icon: PauseCircle,
    badgeClass:
      "relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 text-white border border-slate-300/40 backdrop-blur-xl shadow-lg shadow-slate-500/25 hover:shadow-slate-400/35 hover:border-slate-200/50 hover:ring-2 hover:ring-slate-400/50",
    dotClass: "bg-slate-500",
    glow: "from-slate-500/15 to-zinc-600/10",
  },
  PAID: {
    label: "Paid",
    icon: Users,
    badgeClass:
      "relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 text-white border border-sky-300/40 backdrop-blur-xl shadow-lg shadow-sky-500/25 hover:shadow-sky-400/35 hover:border-sky-200/50 hover:ring-2 hover:ring-sky-400/50",
    dotClass: "bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.7)]",
    glow: "from-sky-500/20 to-blue-600/10",
  },
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "price-low", label: "Price: Low to High" },
];

const FILTER_TABS = [
  { key: "ALL", label: "All", icon: Grid3X3 },
  { key: "LIVE", label: "Live", icon: Flame },
  { key: "UPCOMING", label: "Upcoming", icon: Calendar },
  { key: "ENDED", label: "Ended", icon: Clock },
  { key: "PAID", label: "Paid", icon: CheckCircle2 },
];

function StatChip({ icon: Icon, label, value, colorClass, glowClass }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:border-white/10">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${colorClass}`}
      >
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div>
        <p className="text-lg font-black tracking-tight text-white">{value}</p>
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-20 text-center">
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/10 to-indigo-500/10 ring-1 ring-white/10">
          <Search className="h-8 w-8 text-sky-400/70" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/10">
          <X className="h-3 w-3 text-slate-500" />
        </div>
      </div>
      <p className="mt-6 text-lg font-bold text-white">No auctions found</p>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
        No listings match your current filters. Try adjusting them or check back
        later.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-6 rounded-xl border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white"
        onClick={() => {
          window.location.reload();
        }}
      >
        Reset Filters
      </Button>
    </div>
  );
}

function AuctionCard({ auction }) {
  const navigate = useNavigate();
  const config = STATUS_CONFIG[auction.status] || STATUS_CONFIG.ENDED;
  const StatusIcon = config.icon;

  const bgGlow = config.glow || "from-white/10 to-transparent";

  return (
    <Card
      className="group/card relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl transition-all duration-700 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)]"
    >
      {/* multi-layer ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.03] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
      <div className={`pointer-events-none absolute -inset-2 bg-gradient-to-br ${bgGlow} opacity-0 blur-2xl group-hover/card:opacity-60 transition-opacity duration-700`} />

      {/* subtle grid pattern overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:24px_24px]" />

      <div className="relative">
        {/* ── Image ── */}
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-black/30">
          <img
            src={auction.image}
            alt={auction.title}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover/card:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

          {/* premium shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 translate-x-[-100%] group-hover/card:translate-x-[100%] group-hover/card:opacity-100 transition-all duration-1000 ease-out" />

          {/* status badge */}
          <div className="absolute top-3 right-3 z-10">
            <Badge
              className={`flex items-center gap-1.5 border-0 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] backdrop-blur-xl shadow-lg ${config.badgeClass}`}
            >
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </Badge>
          </div>

          
        </div>

        {/* ── Content ── */}
        <div className="space-y-3 p-5">
          {/* title */}
          <h3 className="line-clamp-2 text-[17px] font-black leading-snug tracking-[-0.02em] text-white transition-all duration-300 group-hover/card:text-sky-300 group-hover/card:tracking-[-0.01em]">
            {auction.title}
          </h3>

          {/* description */}
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
            {auction.description}
          </p>

          {/* meta row — bid count + time */}
          {(auction.bidCount != null || auction.timeRemaining) && (
            <div className="flex items-center gap-4 pt-1">
              {auction.bidCount != null && (
                <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-400 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]">
                  <Gavel className="h-3 w-3 text-slate-600" />
                  <span className="font-semibold text-slate-400">
                    {auction.bidCount}
                  </span>{" "}
                  bids
                </div>
              )}
              {auction.timeRemaining && (
                <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-400 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]">
                  <Clock className="h-3 w-3 text-slate-600" />
                  <span className="font-semibold text-slate-400">
                    {auction.timeRemaining}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* bottom bar — price + CTA */}
          <div className="flex items-end justify-between border-t border-white/[0.06] pt-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                {auction.status === "LIVE" && (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                )}
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500/90">
                  {auction.status === "LIVE"
                    ? "Current Price"
                    : auction.status === "UPCOMING"
                      ? "Starting Price"
                      : "Final Price"}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <IndianRupee className="h-5 w-5 text-white/90" />

                <span className="text-[28px] font-black tracking-[-0.03em] text-white">
                  {Number(auction.currentPrice ?? 0).toLocaleString()}
                </span>
              </div>
            </div>



            <Button
              size="sm"
              className={`cursor-pointer h-9 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${auction.status === "LIVE"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105"
                : auction.status === "UPCOMING"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-105"
                  : "bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] hover:text-white"
                }`}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/auction/${auction._id}`);
              }}
            >
              {auction.status === "LIVE"
                ? "Place Bid"
                : auction.status === "UPCOMING"
                  ? "View"
                  : "Details"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function DashboardAuctions() {
  const [auctions, setAuctions] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function loadAuctions() {
      try {
        const res = await API.get("/auctions");
        if (!cancelled) setAuctions(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadAuctions();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // ── Filter, search, sort ──
  const processedAuctions = useMemo(() => {
    let result =
      filter === "ALL" ? [...auctions] : auctions.filter((a) => a.status === filter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q),
      );
    }

    

    switch (sortBy) {
      case "price-high":
        result.sort((a, b) => Number(b.currentPrice || 0) - Number(a.currentPrice || 0));
        break;
      case "price-low":
        result.sort((a, b) => Number(a.currentPrice || 0) - Number(b.currentPrice || 0));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [auctions, filter, searchQuery, sortBy]);

  // ── Stats ──
  const stats = useMemo(() => {
    const live = auctions.filter((a) => a.status === "LIVE").length;
    const upcoming = auctions.filter((a) => a.status === "UPCOMING").length;
    const ended = auctions.filter((a) => a.status === "ENDED").length;
    const paid = auctions.filter((a) => a.status === "PAID").length;
    return { live, upcoming, ended, paid, total: auctions.length };
  }, [auctions]);

  const activeFilterCount =
    filter !== "ALL" ? 1 : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ═══════════════════════════════════════════
          HERO HEADER
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-slate-950/90 via-indigo-950/50 to-slate-900/80 px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:rounded-[2rem] sm:px-8 sm:py-10">
        {/* ambient orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-52 w-52 rounded-full bg-sky-500/15 blur-[80px]" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[60px]" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-sky-300 backdrop-blur-xl">
              <Zap className="h-3 w-3 text-sky-400" />
              Marketplace
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-[2.5rem]">
              Auction{" "}
              <span className="bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent">
                Listings
              </span>
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
              Browse live, upcoming, and completed auctions in real time. Find
              your next catch before the gavel falls.
            </p>
          </div>

          <Button
            className="cursor-pointer shrink-0 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-sm font-bold text-white shadow-[0_0_30px_rgba(56,189,248,0.3)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(56,189,248,0.5)] hover:scale-105"
            onClick={() => {
              if (user?.role.toUpperCase() !== "SELLER") {
                toast("Become a seller to create auctions", {
                  icon: "🛍️",
                });
                return;
              }

              navigate("/dashboard/create");
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Auction
          </Button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STAT CHIPS
      ═══════════════════════════════════════════ */}
      <section className="flex flex-wrap gap-3">
        <StatChip
          icon={Grid3X3}
          label="Total"
          value={stats.total}
          colorClass="from-slate-500/20 to-slate-600/20"
          glowClass=""
        />
        <StatChip
          icon={Flame}
          label="Live"
          value={stats.live}
          colorClass="from-emerald-500/30 to-teal-500/20"
          glowClass=""
        />
        <StatChip
          icon={Calendar}
          label="Upcoming"
          value={stats.upcoming}
          colorClass="from-amber-500/30 to-orange-500/20"
          glowClass=""
        />
        <StatChip
          icon={Clock}
          label="Ended"
          value={stats.ended}
          colorClass="from-slate-500/20 to-zinc-600/20"
          glowClass=""
        />
        <StatChip
          icon={CheckCircle2}
          label="Paid"
          value={stats.paid}
          colorClass="from-sky-500/20 to-blue-500/20"
          glowClass=""
        />
      </section>

      {/* ═══════════════════════════════════════════
          SEARCH + FILTER BAR
      ═══════════════════════════════════════════ */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* search */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            placeholder="Search auctions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:border-sky-500/40 focus:outline-none focus:ring-2 focus:ring-sky-500/20 backdrop-blur-sm transition-all duration-300"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-600 hover:bg-white/10 hover:text-slate-300 transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="cursor-pointer h-10 w-[180px] rounded-xl border border-white/[0.06] bg-white/[0.03] text-sm text-slate-300 backdrop-blur-sm focus:border-sky-500/40 focus:ring-2 focus:ring-sky-500/20">
              <ArrowUpDown className="mr-2 h-3.5 w-3.5 text-slate-600" />
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>

            <SelectContent className="border-white/10 bg-slate-900/95 backdrop-blur-xl text-slate-200">
              {SORT_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="
            cursor-pointer
            text-slate-200
            hover:bg-white/10
            focus:bg-white/10
            data-[highlighted]:bg-white/10
          "
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FILTER TABS
      ═══════════════════════════════════════════ */}
      <section className="-mx-2 flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => {
          const isActive = filter === tab.key;
          const count =
            tab.key === "ALL"
              ? auctions.length
              : auctions.filter((a) => a.status === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`cursor-pointer  flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${isActive
                ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-[0_0_24px_rgba(56,189,248,0.35)]"
                : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              <span
                className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] font-black ${isActive
                  ? "bg-white/20 text-white"
                  : "bg-white/[0.06] text-slate-500"
                  }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </section>

      {/* ═══════════════════════════════════════════
          RESULTS COUNT
      ═══════════════════════════════════════════ */}
      {!loading && (
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-600">
            <span className="font-black text-white">
              {processedAuctions.length}
            </span>{" "}
            {processedAuctions.length === 1 ? "listing" : "listings"}
            {filter !== "ALL" && (
              <>
                {" "}
                in{" "}
                <span className="font-bold text-sky-400">{filter}</span>
              </>
            )}
            {searchQuery && (
              <>
                {" "}
                matching{" "}
                <span className="font-bold text-sky-400">
                  "{searchQuery}"
                </span>
              </>
            )}
          </p>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          AUCTION GRID / LIST
      ═══════════════════════════════════════════ */}
      {loading ? (
        <div
          className={`grid gap-5 ${viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1"
            }`}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <AuctionCardSkeleton key={i} />
          ))}
        </div>
      ) : processedAuctions.length === 0 ? (
        <EmptyState />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {processedAuctions.map((auction, idx) => (
            <div
              key={auction._id}
              style={{ animationDelay: `${idx * 60}ms`, animationFillMode: "backwards" }}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <AuctionCard auction={auction} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {processedAuctions.map((auction, idx) => {
            const config = STATUS_CONFIG[auction.status] || STATUS_CONFIG.ENDED;
            const StatusIcon = config.icon;
            return (
              <div
                key={auction._id}
                style={{
                  animationDelay: `${idx * 50}ms`,
                  animationFillMode: "backwards",
                }}
                className="animate-in fade-in slide-in-from-bottom-3 duration-400"
              >
                <Card
                  className="group/list flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.06] hover:border-white/14 sm:flex-row sm:items-center"
                >
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-black/20">

                    <img
                      src={auction.image}
                      alt={auction.title}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover/list:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col gap-1 sm:gap-0.5">
                    <h3 className="text-sm font-bold text-white transition-colors duration-200 group-hover/list:text-sky-300 lg:text-base">
                      {auction.title}
                    </h3>
                    <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-400/90 transition-colors duration-300 group-hover/card:text-slate-300">
                      {auction.description}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                      {auction.bidCount != null && (
                        <span className="flex items-center gap-1">
                          <Gavel className="h-3 w-3" />
                          <span className="font-semibold text-slate-400">
                            {auction.bidCount}
                          </span>{" "}
                          bids
                        </span>
                      )}
                      {auction.timeRemaining && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {auction.timeRemaining}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-white/[0.05] pt-3 sm:border-t-0 sm:border-l sm:border-white/[0.05] sm:pt-0 sm:pl-4">
                    <div>
                      <Badge
                        className={`flex w-fit items-center gap-1 border-0 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.15em] backdrop-blur-sm ${config.badgeClass}`}
                      >
                        <StatusIcon className="h-2.5 w-2.5" />
                        {config.label}
                      </Badge>
                      <p className="mt-2 text-lg font-black tracking-tight text-white">
                        Rs.{" "}
                        {Number(auction.currentPrice ?? 0).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-lg text-slate-500 hover:bg-white/[0.06] hover:text-sky-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/auction/${auction._id}`);
                      }}
                    >
                      View
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { DashboardAuctions };
