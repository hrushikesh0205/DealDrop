import { useEffect, useState, useMemo } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";
import fallback from "../assets/fallback.png";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Search,
  X,
  ArrowUpDown,
  Clock,
  Gavel,
  PlayCircle,
  PauseCircle,
  Calendar,
  Zap,
  IndianRupee,
  ExternalLink,
  Crown,
  Target,
  TrendingDown,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

const BID_STATUS_CONFIG = {
  WINNING: {
    label: "Winning",
    icon: Crown,
    className:
      "bg-gradient-to-br from-emerald-500/90 to-teal-600/90 text-white border border-emerald-300/50 shadow-lg shadow-emerald-500/30 backdrop-blur-xl ring-1 ring-emerald-400/30",
    hoverClassName:
      "hover:brightness-125 hover:shadow-[0_8px_32px_rgba(16,185,129,0.55)] hover:border-emerald-200/70 hover:ring-2 hover:ring-emerald-300/60 hover:-translate-y-0.5 hover:scale-[1.02]",
    chipColor: "from-emerald-400 via-emerald-500 to-teal-500",
    textColor: "text-white",
    bgGlow: "from-emerald-500/30 to-teal-500/20",
    ringGlow: "ring-emerald-400/40",
  },
  OUTBID: {
    label: "Outbid",
    icon: TrendingDown,
    className:
      "bg-gradient-to-br from-rose-500/90 to-pink-600/90 text-white border border-rose-300/50 shadow-lg shadow-rose-500/30 backdrop-blur-xl ring-1 ring-rose-400/30",
    hoverClassName:
      "hover:brightness-125 hover:shadow-[0_8px_32px_rgba(244,63,94,0.55)] hover:border-rose-200/70 hover:ring-2 hover:ring-rose-300/60 hover:-translate-y-0.5 hover:scale-[1.02]",
    chipColor: "from-rose-400 via-rose-500 to-pink-500",
    textColor: "text-white",
    bgGlow: "from-rose-500/30 to-pink-500/20",
    ringGlow: "ring-rose-400/40",
  },
  WON: {
    label: "Won",
    icon: Trophy,
    className:
      "bg-gradient-to-br from-sky-500/90 to-blue-600/90 text-white border border-sky-300/50 shadow-lg shadow-sky-500/30 backdrop-blur-xl ring-1 ring-sky-400/30",
    hoverClassName:
      "hover:brightness-125 hover:shadow-[0_8px_32px_rgba(14,165,233,0.55)] hover:border-sky-200/70 hover:ring-2 hover:ring-sky-300/60 hover:-translate-y-0.5 hover:scale-[1.02]",
    chipColor: "from-sky-400 via-sky-500 to-blue-500",
    textColor: "text-white",
    bgGlow: "from-sky-500/30 to-blue-500/20",
    ringGlow: "ring-sky-400/40",
  },
  LOST: {
    label: "Lost",
    icon: Target,
    className:
      "bg-gradient-to-br from-slate-500/90 to-zinc-600/90 text-white border border-slate-300/50 shadow-lg shadow-slate-500/30 backdrop-blur-xl ring-1 ring-slate-400/30",
    hoverClassName:
      "hover:brightness-125 hover:shadow-[0_8px_32px_rgba(148,163,184,0.4)] hover:border-slate-200/60 hover:ring-2 hover:ring-slate-300/50 hover:-translate-y-0.5 hover:scale-[1.02]",
    chipColor: "from-slate-400 via-slate-500 to-zinc-600",
    textColor: "text-white",
    bgGlow: "from-slate-500/20 to-zinc-600/15",
    ringGlow: "ring-slate-400/30",
  },
  UNKNOWN: {
    label: "Unknown",
    icon: Clock,
    className:
      "bg-gradient-to-br from-slate-600/90 to-slate-700/90 text-white border border-slate-400/50 shadow-lg shadow-slate-500/20 backdrop-blur-xl ring-1 ring-slate-400/20",
    hoverClassName:
      "hover:brightness-125 hover:shadow-[0_8px_32px_rgba(148,163,184,0.35)] hover:border-slate-300/60 hover:ring-2 hover:ring-slate-300/50 hover:-translate-y-0.5 hover:scale-[1.02]",
    chipColor: "from-slate-500 via-slate-600 to-slate-700",
    textColor: "text-white",
    bgGlow: "from-slate-500/15 to-slate-600/10",
    ringGlow: "ring-slate-400/20",
  },
};

const AUCTION_STATUS_CONFIG = {
  LIVE: {
    label: "Live",
    icon: PlayCircle,
    badgeClass:
      "relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white border border-emerald-300/40 backdrop-blur-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/35 hover:border-emerald-200/50 hover:ring-2 hover:ring-emerald-400/50",
    dotClass: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]",
  },
  UPCOMING: {
    label: "Upcoming",
    icon: Calendar,
    badgeClass:
      "relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white border border-amber-300/40 backdrop-blur-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-400/35 hover:border-amber-200/50 hover:ring-2 hover:ring-amber-400/50",
    dotClass: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]",
  },
  ENDED: {
    label: "Ended",
    icon: PauseCircle,
    badgeClass:
      "relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 text-white border border-slate-300/40 backdrop-blur-xl shadow-lg shadow-slate-500/25 hover:shadow-slate-400/35 hover:border-slate-200/50 hover:ring-2 hover:ring-slate-400/50",
    dotClass: "bg-slate-500",
  },
  PAID: {
    label: "Paid",
    icon: Users,
    badgeClass:
      "relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 text-white border border-sky-300/40 backdrop-blur-xl shadow-lg shadow-sky-500/25 hover:shadow-sky-400/35 hover:border-sky-200/50 hover:ring-2 hover:ring-sky-400/50",
    dotClass: "bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.7)]",
  },
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "amount-high", label: "Bid: High to Low" },
  { value: "amount-low", label: "Bid: Low to High" },
];

const FILTER_TABS = [
  { key: "ALL", label: "All", icon: Gavel },
  { key: "WINNING", label: "Winning", icon: Crown },
  { key: "OUTBID", label: "Outbid", icon: TrendingDown },
  { key: "WON", label: "Won", icon: Trophy },
  { key: "LOST", label: "Lost", icon: Target },
];


function computeBidStatus(bid) {

  const auction = bid.auctionId;

  if (!auction) return "UNKNOWN";

  const winnerId =
    auction.winnerId?._id?.toString() ||
    auction.winnerId?.toString();

  const highestBidder =
    auction.highestBidder?._id?.toString() ||
    auction.highestBidder?.toString();

  const bidderId =
    bid.bidderId?._id?.toString() ||
    bid.bidderId?.toString();

  // Auction finished
  if (
    auction.status === "ENDED" ||
    auction.status === "PAID"
  ) {

    if (winnerId === bidderId) {
      return "WON";
    }

    return "LOST";
  }

  // Live auction
  if (highestBidder === bidderId) {
    return "WINNING";
  }

  return "OUTBID";
}

function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function BidCardSkeleton() {
  return (
    <Card className="group/card overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl">
      {/* image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/30">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute top-3 right-3">
          <Skeleton className="h-5 w-20 rounded-full bg-white/10" />
        </div>
        <div className="absolute top-3 left-3">
          <Skeleton className="h-5 w-14 rounded-full bg-white/10" />
        </div>
      </div>
      {/* content */}
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-48 rounded-lg bg-white/10" />
          <Skeleton className="h-4 w-16 rounded bg-white/10" />
        </div>
        <Skeleton className="h-4 w-full rounded bg-white/10" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Skeleton className="h-20 rounded-xl bg-white/10" />
          <Skeleton className="h-20 rounded-xl bg-white/10" />
        </div>
        <div className="border-t border-white/[0.06] pt-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32 rounded bg-white/10" />
            <Skeleton className="h-8 w-20 rounded-xl bg-white/10" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function StatChip({ icon: IconComp, label, value, colorClass }) {
  const Icon = IconComp;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:border-white/10">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${colorClass}`}>
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

function formatBidDateTime(dateString) {
  const date = new Date(dateString);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday =
    date.toDateString() === today.toDateString();

  const isYesterday =
    date.toDateString() === yesterday.toDateString();

  const time = formatTime(dateString);

  if (isToday) {
    return `Today • ${time}`;
  }

  if (isYesterday) {
    return `Yesterday • ${time}`;
  }

  return `${formatDate(dateString)} • ${time}`;
}

function EmptyState({ searchQuery, filterStatus, onReset }) {
  const hasActiveFilters = searchQuery || filterStatus !== "ALL";
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-20 text-center backdrop-blur-xl">
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/10 to-indigo-500/10 ring-1 ring-white/10">
          <Gavel className="h-8 w-8 text-sky-400/70" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/10">
          <X className="h-3 w-3 text-slate-500" />
        </div>
      </div>
      <h3 className="mt-6 text-xl font-bold text-white">
        {hasActiveFilters ? "No bids match your filters" : "No bids placed yet"}
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
        {hasActiveFilters
          ? "Try adjusting your search or filter criteria to find what you are looking for."
          : "When you place a bid, your activity will show up here with real-time status tracking."}
      </p>
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer mt-6 rounded-xl border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white"
          onClick={onReset}
        >
          <Sparkles className="mr-2 h-3.5 w-3.5" />
          Reset Filters
        </Button>
      )}
    </div>
  );
}

function BidCard({ bid }) {

  const navigate = useNavigate();

  const auction = bid.auctionId;

  const status = computeBidStatus(bid);
  const config = BID_STATUS_CONFIG[status] || BID_STATUS_CONFIG.UNKNOWN;
  const auctionStatusConfig = auction?.status
    ? AUCTION_STATUS_CONFIG[auction.status]
    : null;
  const StatusIcon = config.icon;
  const AuctionStatusIcon = auctionStatusConfig?.icon;


  return (
    <Card
      className="group/card relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl transition-[transform,border-color,box-shadow] duration-700 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)]"
    >
      {/* multi-layer ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.03] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
      <div className={`pointer-events-none absolute -inset-2 bg-gradient-to-br ${config.bgGlow} opacity-0 blur-2xl group-hover/card:opacity-60 transition-opacity duration-700`} />

      {/* subtle grid pattern overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:24px_24px]" />

      <div className="relative">
        {/* ── Auction Image ── */}
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-black/30">
          <img
            src={auction?.image || fallback}
            alt={auction?.title || "Auction"}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover/card:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

          {/* premium shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 translate-x-[-100%] group-hover/card:translate-x-[100%] group-hover/card:opacity-100 transition-all duration-1000 ease-out" />

          {/* top-right: auction status badge */}
          {auctionStatusConfig && (
            <div className="absolute top-3 right-3 z-10">
              <Badge
                className={`flex items-center gap-1.5 border-0 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] backdrop-blur-xl shadow-lg ${auctionStatusConfig.badgeClass
                  }`}
              >
                <AuctionStatusIcon className="h-3 w-3" />
                {auctionStatusConfig.label}
              </Badge>
            </div>
          )}

          {/* top-left: bid status badge */}
          <div className="absolute top-3 left-3 z-10">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] backdrop-blur-xl transition-all duration-300 ${config.className} ${config.hoverClassName} shadow-lg`}
            >
              <StatusIcon className="h-3 w-3" />
              <span>{config.label}</span>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="space-y-4 p-5">
          {/* auction title */}
          <h3
            className="line-clamp-2 text-base font-bold leading-snug tracking-tight text-white transition-all duration-300 group-hover/card:text-sky-300 group-hover/card:tracking-wide"
          >
            {auction?.title || "Untitled Auction"}
          </h3>

          {/* bid timestamp */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            {auction?.endTime && (
              <div
                className="
        group/meta
        relative overflow-hidden
        flex items-center gap-2
        rounded-full
        border border-white/[0.08]
        bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent
        px-3.5 py-1.5
        text-slate-300
        backdrop-blur-xl
        shadow-[0_4px_20px_rgba(0,0,0,0.25)]
        transition-all duration-300
        hover:border-white/20
        hover:bg-white/[0.08]
        hover:shadow-[0_8px_30px_rgba(255,255,255,0.06)]
      "
              >
                {/* subtle glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover/meta:opacity-100" />

                {/* icon */}
                <div
                  className="
          relative
          flex h-5 w-5 items-center justify-center
          rounded-full
          bg-white/[0.05]
          ring-1 ring-white/[0.06]
        "
                >
                  <Calendar className="h-3 w-3 text-sky-300" />
                </div>

                {/* text */}
                <span className="relative font-medium tracking-wide">
                  {auction?.status === "ENDED" || auction?.status === "PAID"
                    ? "Ended"
                    : "Ends"}{" "}
                  <span className="font-bold text-white">
                    {formatDate(auction.endTime)}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* price comparison cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Your Bid */}
            <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-black/40 to-black/30 p-4 backdrop-blur-md transition-all duration-300 group-hover/card:border-white/15">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  Your Bid
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <IndianRupee className="h-4 w-4 text-white" />
                  <p className="text-xl font-black text-white tracking-tight tabular-nums group-hover/card:text-sky-300 transition-colors">
                    {Number(bid.amount).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Price */}
            <div
              className={`relative overflow-hidden rounded-xl border p-4 backdrop-blur-md transition-all duration-300 group-hover/card:brightness-110 ${status === "WINNING"
                ? "border-emerald-300/60 bg-gradient-to-br from-emerald-500/95 to-teal-600/95 shadow-[0_8px_32px_rgba(16,185,129,0.35)]"
                : status === "OUTBID"
                  ? "border-rose-300/60 bg-gradient-to-br from-rose-500/95 to-pink-600/95 shadow-[0_8px_32px_rgba(244,63,94,0.35)]"
                  : status === "WON"
                    ? "border-sky-300/60 bg-gradient-to-br from-sky-500/95 to-blue-600/95 shadow-[0_8px_32px_rgba(14,165,233,0.35)]"
                    : status === "LOST"
                      ? "border-slate-300/60 bg-gradient-to-br from-slate-500/95 to-zinc-600/95 shadow-[0_8px_32px_rgba(148,163,184,0.25)]"
                      : "border-sky-300/60 bg-gradient-to-br from-sky-500/95 to-blue-600/95 shadow-[0_8px_32px_rgba(14,165,233,0.35)]"
                }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center gap-1.5">
                  {status === "WINNING" && (
                    <Zap className="h-3 w-3 text-white/90" />
                  )}
                  {status === "OUTBID" && (
                    <TrendingDown className="h-3 w-3 text-white/90" />
                  )}
                  {status === "WON" && (
                    <Trophy className="h-3 w-3 text-white/90" />
                  )}
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest text-white/90"
                  >
                    {auction?.status === "ENDED" || auction?.status === "PAID"
                      ? "Final Price"
                      : "Current Price"}
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <IndianRupee
                    className="h-4 w-4 text-white/90"
                  />
                  <p
                    className="text-xl font-black tracking-tight tabular-nums text-white"
                  >
                    {auction?.currentPrice != null
                      ? Number(auction.currentPrice).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── footer: placed at timestamp + action ─── */}
          <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-600">
                Your Bid Placed
              </p>
              <p className="mt-0.5 text-xs font-semibold text-white tabular-nums">
                {formatBidDateTime(bid.createdAt)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/auction/${auction?._id}`);
              }}
              className="cursor-pointer rounded-lg h-8 px-3 text-[11px] font-bold uppercase tracking-wider text-sky-400 hover:bg-white/10 hover:text-sky-300 transition-all group-hover/card:shadow-[0_4px_16px_rgba(56,189,248,0.25)]"
            >
              <ExternalLink className="mr-1.5 h-3.5 w-3.5 transition-transform group-hover/card:translate-x-0.5" />
              View
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function MyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchBids();
  }, []);


  async function fetchBids() {
    try {
      setLoading(true);
      const res = await API.get("/my-bids");
      setBids(res.data || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load bids");
    } finally {
      setLoading(false);
    }
  }

  

  // ── Filter / search / sort ──
  const processedBids = useMemo(() => {
    let result = [...bids];

    const latestBidMap = new Map();

    result.forEach((bid) => {
      const auctionId = bid.auctionId?._id;

      if (!auctionId) return;

      const existing = latestBidMap.get(auctionId);

      if (
        !existing ||
        new Date(bid.createdAt) > new Date(existing.createdAt)
      ) {
        latestBidMap.set(auctionId, bid);
      }
    });
    

    result = Array.from(latestBidMap.values());

    // filter by status
    if (filterStatus !== "ALL") {
      result = result.filter((bid) => computeBidStatus(bid) === filterStatus);
    }

    // search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (bid) =>
          bid.auctionId?.title?.toLowerCase().includes(q) ||
          bid.auctionId?.description?.toLowerCase().includes(q),
      );
    }

    // sort
    switch (sortBy) {
      case "amount-high":
        result.sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0));
        break;
      case "amount-low":
        result.sort((a, b) => Number(a.amount || 0) - Number(b.amount || 0));
        break;
      case "oldest":
        result.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      default:
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }

    return result;
  }, [bids, filterStatus, searchQuery, sortBy]);

  // ── Compute stats ──
  const bidStats = useMemo(() => {
    const stats = {
      total: processedBids.length,
      WINNING: 0,
      OUTBID: 0,
      WON: 0,
      LOST: 0,
    };

    processedBids.forEach((bid) => {
      const s = computeBidStatus(bid);

      if (s in stats) {
        stats[s]++;
      }
    });

    return stats;
  }, [processedBids]);

  return (
    <div className="space-y-7 animate-in fade-in duration-700">
      {/* ═══════════════════════════════════════════
          HERO HEADER
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-slate-950/90 via-violet-950/40 to-slate-900/80 px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:rounded-[2rem] sm:px-8 sm:py-10">
        {/* ambient orbs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-violet-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-52 w-52 rounded-full bg-sky-500/15 blur-[80px]" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[60px]" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-violet-300 backdrop-blur-xl">
              <Zap className="h-3 w-3 text-violet-400" />
              Bid Center
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-[2.5rem]">
              My{" "}
              <span className="bg-gradient-to-r from-violet-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                Bids
              </span>
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
              Track every bid across all auctions. See if you are winning,
              outbid, or celebrating a win in real time.
            </p>
          </div>

          {/* summary chip */}
          {!loading && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 backdrop-blur-xl">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Total Bids Placed
              </p>
              <p className="text-3xl font-black text-white">{bidStats.total}</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STAT CHIPS
      ═══════════════════════════════════════════ */}
      {!loading && (
        <section className="-mx-1 flex flex-wrap gap-2">
          <StatChip
            icon={Crown}
            label="Winning"
            value={bidStats.WINNING}
            colorClass="from-emerald-500/30 to-teal-500/20"
          />
          <StatChip
            icon={TrendingDown}
            label="Outbid"
            value={bidStats.OUTBID}
            colorClass="from-rose-500/30 to-pink-500/20"
          />
          <StatChip
            icon={Trophy}
            label="Won"
            value={bidStats.WON}
            colorClass="from-sky-500/20 to-blue-500/20"
          />
          <StatChip
            icon={Target}
            label="Lost"
            value={bidStats.LOST}
            colorClass="from-slate-500/20 to-zinc-600/20"
          />
        </section>
      )}

      {/* ═══════════════════════════════════════════
          SEARCH + FILTER BAR
      ═══════════════════════════════════════════ */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* search */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
          <Input
            type="text"
            placeholder="Search auctions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] pl-10 pr-9 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-sky-500/40 focus:outline-none focus:ring-2 focus:ring-sky-500/20 backdrop-blur-sm transition-all duration-300"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-600 hover:bg-white/10 hover:text-slate-300 transition-all"
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
                <SelectItem key={opt.value} value={opt.value} className="
    cursor-pointer
    text-slate-200
    hover:bg-white/10
    focus:bg-white/10
    data-[highlighted]:bg-white/10
  ">
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
      <section className="-mx-1 flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => {
          const isActive = filterStatus === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`cursor-pointer relative flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${isActive
                ? "bg-gradient-to-r from-violet-500 to-sky-500 text-white shadow-[0_0_24px_rgba(139,92,246,0.35)]"
                : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </section>

      {/* ═══════════════════════════════════════════
          LOADING SKELETONS
      ═══════════════════════════════════════════ */}
      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BidCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && processedBids.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-600">
            <span className="font-black text-white">
              {processedBids.length}
            </span>{" "}
            {processedBids.length === 1 ? "bid" : "bids"}
            {filterStatus !== "ALL" && (
              <>
                {" "}
                with status{" "}
                <span className="font-bold text-violet-400">{filterStatus}</span>
              </>
            )}
            {searchQuery && (
              <>
                {" "}
                matching{" "}
                <span className="font-bold text-violet-400">
                  "{searchQuery}"
                </span>
              </>
            )}
          </p>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          BID CARDS GRID
      ═══════════════════════════════════════════ */}
      {!loading && processedBids.length === 0 && (
        <EmptyState
          searchQuery={searchQuery}
          filterStatus={filterStatus}
          onReset={() => {
            setSearchQuery("");
            setFilterStatus("ALL");
          }}
        />
      )}

      {!loading && processedBids.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {processedBids.map((bid, idx) => (
            <div
              key={bid._id}
              style={{
                animationDelay: `${idx * 60}ms`,
                animationFillMode: "backwards",
              }}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <BidCard bid={bid} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { MyBids };
