import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { API } from "../api/axios";
import { Skeleton } from "../components/ui/skeleton";
import {
  Search,
  Gavel,
  Package,
  Award,
  ArrowUpRight,
  Clock,
  ExternalLink,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  ChevronRight,
  IndianRupee,
} from "lucide-react";
import toast from "react-hot-toast";

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-8 w-24" />
      <Skeleton className="mt-2 h-4 w-32" />
    </div>
  );
}

// eslint-disable-next-line no-unused-vars -- Icon is used as JSX component
function StatCard({ icon: Icon, label, value, subLabel, color, glowColor, trend, delay = 0 }) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-[3px] hover:bg-white/[0.07] hover:border-white/20"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      {/* subtle glow orb */}
      <div className={`pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60 ${glowColor}`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          {trend && (
            <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 ring-1 ring-emerald-400/20">
              <ArrowUpRight className="h-3 w-3" />
              {trend}
            </div>
          )}
        </div>

        <p className="mt-4 text-3xl font-black tracking-tight text-white">{value}</p>
        <p className="mt-1 text-sm text-slate-400">{label}</p>
        {subLabel && <p className="mt-0.5 text-[11px] text-slate-500">{subLabel}</p>}
      </div>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars -- Icon is used as JSX component
function QuickAction({ icon: Icon, label, description, onClick, color, delay = 0, badge }) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer group relative flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07] hover:border-white/20"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      {/* gradient accent bar on hover */}
      <div
        className={`absolute left-0 top-4 h-12 w-[3px] origin-top scale-y-0 rounded-r-full blur-[0.5px] transition-transform duration-300 group-hover:scale-y-100 ${color}`}
      />

      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">{label}</p>
          {badge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-400 ring-1 ring-amber-400/20">
              <Sparkles className="h-2.5 w-2.5" /> {badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-slate-400" />
    </button>
  );
}

function StatusBadgeDot({ status }) {
  const map = {
    LIVE: "bg-emerald-500",
    UPCOMING: "bg-amber-500",
    ENDED: "bg-slate-500",
    PAID: "bg-sky-500",
  };
  return (
    <span
      className={`relative inline-block h-2.5 w-2.5 rounded-full ${map[status] || "bg-slate-500"} shadow-[0_0_8px_currentColor] transition-shadow duration-300 group-hover:shadow-[0_0_12px_currentColor]`}
    />
  );
}

function RecentActivityTable({ auctions = [] }) {
  const navigate = useNavigate();

  if (auctions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
          <Clock className="h-6 w-6 text-slate-500" />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-300">No recent activity</p>
        <p className="mt-1 text-xs text-slate-500">Browse the marketplace to see live auctions here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0b1020]/95 via-[#0d1328]/95 to-[#0a0f1d]/95">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="w-1/4 px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
                Status
              </th>

              <th className="w-1/4 px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
                Auction
              </th>

              <th className="w-1/4 px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
                Current Price
              </th>

              <th className="w-1/4 px-6 py-4 text-center text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {auctions.map((auction) => (
              <tr
                key={auction._id}
                className="
                group
                border-b border-white/[0.04]
                transition-all duration-300
                last:border-0
                hover:bg-white/[0.04]
hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]
              "
              >
                {/* STATUS */}
                <td className="px-6 py-5 align-middle">
                  <div className="flex items-center gap-3">
                    <StatusBadgeDot status={auction.status} />

                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 transition-all duration-300 group-hover:text-slate-200 group-hover:tracking-[0.2em]">
                      {auction.status}
                    </span>
                  </div>
                </td>

                {/* AUCTION */}
                <td className="px-5 py-5 align-middle">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-bold tracking-[-0.02em] text-white transition-all duration-300 group-hover:text-sky-300 ">
                      {auction.title}
                    </p>

                    <p className="mt-1.5 text-[11px] text-slate-400 transition-all duration-300 group-hover:text-slate-300">
                      {auction.status === "ENDED" ||
                        auction.status === "PAID"
                        ? "Auction ended"
                        : "Auction live"}
                    </p>
                  </div>
                </td>

                {/* CURRENT BID */}
                <td className="px-6 py-5 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.03] backdrop-blur shadow-[0_0_8px_rgba(14,165,233,0.2)] transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(14,165,233,0.3)] group-hover:border-white/[0.2]">
                      <IndianRupee className="h-4 w-4 text-sky-400" />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 transition-all duration-300 group-hover:text-slate-200">
                        Current Price
                      </p>

                      <p className="mt-0.5 text-[24px] font-black leading-none tracking-[-0.04em] tabular-nums text-white transition-all duration-300 group-hover:text-sky-300 ">
                        {Number(
                          auction.currentPrice
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </td>

                {/* ACTION */}
                <td className="px-5 py-5 align-middle">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => navigate(`/auction/${auction._id}`)}
                      className="
    relative
    cursor-pointer
    group
    flex h-11 w-11 items-center justify-center
    overflow-hidden
    rounded-2xl
    border border-white/[0.08]
    bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent
    text-slate-500
    backdrop-blur-xl
    transition-all duration-500
    hover:-translate-y-0.5
    hover:border-sky-400/40
    hover:bg-sky-500/[0.08]
    hover:text-sky-300
    hover:shadow-[0_0_30px_rgba(14,165,233,0.18)]
    hover:ring-1 hover:ring-sky-400/20
  "
                    >
                      {/* ambient glow */}
                      <div
                        className="
      absolute inset-0
      opacity-0
      transition-opacity duration-500
      group-hover:opacity-100
      bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.18),transparent_70%)]
    "
                      />

                      {/* shine effect */}
                      <div
                        className="
      absolute inset-0
      -translate-x-full
      bg-gradient-to-r from-transparent via-white/10 to-transparent
      transition-transform duration-700
      group-hover:translate-x-full
    "
                      />

                      <ExternalLink
                        className="
      relative z-10
      h-[18px] w-[18px]
      transition-all duration-500
      group-hover:scale-110
      group-hover:-translate-y-[1px]
    "
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HomeContent() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [myAuctions, setMyAuctions] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [aRes, bRes] = await Promise.all([
          API.get("/auctions").catch(() => ({ data: [] })),
          API.get("/my-bids").catch(() => ({ data: [] })),
        ]);
        if (!cancelled) {
          setAuctions(aRes.data || []);
          setMyBids(bRes.data || []);
        }
      } catch {
        toast.error("Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (user?.role?.toUpperCase() === "SELLER" && !loading) {
      API.get("/my-auctions")
        .then((res) => setMyAuctions(res.data || []))
        .catch(() => { });
    }
  }, [user, loading]);
  const totalBidCount = auctions.reduce((sum, a) => sum + (a.bidCount || 0), 0);
  const liveCount = auctions.filter((a) => a.status === "LIVE").length;
  const uniqueBidAuctions = [
  ...new Map(
    myBids.map((bid) => [
      bid.auctionId?._id,
      bid
    ])
  ).values()
];
  const totalWon = uniqueBidAuctions.filter((b) => {

    const auction = b.auctionId;

    const winnerId =
      auction?.winnerId?._id?.toString() ||
      auction?.winnerId?.toString();

    const bidderId =
      b?.bidderId?._id?.toString() ||
      b?.bidderId?.toString();

    return (
      auction &&
      (auction.status === "ENDED" || auction.status === "PAID") &&
      winnerId === bidderId
    );

  }).length;
  const totalSpent = myBids.reduce((sum, b) => sum + (b.amount || 0), 0);
  const recentAuctions = useMemo(() => {
    const statusOrder = {
      LIVE: 1,
      UPCOMING: 2,
      ENDED: 3,
      PAID: 4,
    };

    return [...auctions]
      .sort((a, b) => {
        const statusDiff =
          statusOrder[a.status] - statusOrder[b.status];

        // first sort by status priority
        if (statusDiff !== 0) return statusDiff;

        // then newest first inside same status
        return (
          new Date(b.createdAt) -
          new Date(a.createdAt)
        );
      })
      .slice(0, 6);
  }, [auctions]);

  const statCards = [
    {
      icon: Package,
      label: "Total Auctions",
      value: loading ? "—" : auctions.length,
      subLabel: loading ? "Loading…" : `${liveCount} live right now`,
      color: "bg-gradient-to-br from-sky-500 to-indigo-500",
      glow: "bg-sky-500",
      trend: liveCount > 0 ? `${liveCount} live` : null,
    },
    {
      icon: Gavel,
      label: "My Bids",
      value: loading ? "—" : uniqueBidAuctions.length,
      subLabel: loading ? "Loading…" : `${totalWon} won · Rs. ${totalSpent.toLocaleString()}`,
      color: "bg-gradient-to-br from-emerald-500 to-teal-500",
      glow: "bg-emerald-500",
      trend: totalWon > 0 ? `${totalWon} won` : null,
    },
    {
      icon: Package,
      label: "My Listings",
      value: user?.role?.toUpperCase() === "SELLER" ? (loading ? "—" : myAuctions.length) : "—",
      subLabel: user?.role === "SELLER" ? (loading ? "Loading…" : "Seller dashboard") : "Seller-only",
      color: "bg-gradient-to-br from-amber-500 to-orange-500",
      glow: "bg-amber-500",
      trend: null,
    },
    {
      icon: Award,
      label: "Auctions Won",
      value: loading ? "—" : totalWon,
      subLabel: loading ? "Loading…" : `${totalBidCount} total bids placed across the market`,
      color: "bg-gradient-to-br from-violet-500 to-purple-600",
      glow: "bg-violet-500",
      trend: totalWon > 0 ? `${totalWon} wins` : null,
    },
  ];

  const quickActions = [
    {
      icon: Search,
      label: "Browse Auctions",
      description: "Explore live, upcoming, and completed listings",
      onClick: () => navigate("/dashboard/auctions"),
      color: "from-sky-500 to-blue-600",
      badge: null,
    },
    {
      icon: PlusCircle,
      label: "Create Auction",
      description: "List a new item and start attracting bidders",
      onClick: () =>
        user?.role?.toUpperCase() === "SELLER"
          ? navigate("/dashboard/create")
          : toast("Become a SELLER to create auctions", {
            icon: "🛍️",
          }),
      color: "from-emerald-500 to-teal-600",
      badge: user?.role?.toUpperCase() === "SELLER" ? "Seller" : "Unlock",
    },
    {
      icon: Gavel,
      label: "My Bids",
      description: "Track whether you are winning or outbid",
      onClick: () => navigate("/dashboard/bids"),
      color: "from-violet-500 to-purple-600",
      badge: null,
    },
  ];

  const welcomeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ─── Welcome Hero ─── */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/80 via-indigo-950/60 to-slate-900/80 px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:rounded-[2rem] sm:px-8 sm:py-10">
        {/* ambient orbs */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-52 w-52 rounded-full bg-indigo-500/20 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-44 w-44 rounded-full bg-sky-500/20 blur-[70px]" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[60px]" />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-sky-300 backdrop-blur">
              <Sparkles className="h-3 w-3 text-sky-400" />
              DealDrop
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              {welcomeGreeting()},{" "}
              <span className="bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent">
                {user?.name?.split(" ")[0] || "User"}
              </span>
              👋
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Here&apos;s what&apos;s happening across your auctions and bids today.
              Track bids, monitor auctions, and never miss an opportunity.
            </p>
          </div>

          {/* role badge */}
          {user?.role?.toUpperCase() === "SELLER" && (
            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Seller Account</span>
            </div>
          )}
          {user?.role?.toUpperCase() === "ADMIN" && (
            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2">
              <Award className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Admin Access</span>
            </div>
          )}
        </div>
      </section>

      {/* ─── Stat Cards ─── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Overview</h2>
          <span className="text-[11px] text-slate-600">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            : statCards.map((card, i) => (
              <StatCard
                key={card.label}
                icon={card.icon}
                label={card.label}
                value={card.value}
                color={card.color}
                glowColor={card.glow}
                delay={i * 60}
              />
            ))}
        </div>
      </section>

      {/* ─── Quick Actions ─── */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action, i) => (
            <QuickAction
              key={action.label}
              icon={action.icon}
              label={action.label}
              description={action.description}
              onClick={action.onClick}
              color={action.color}
              delay={i * 70}
              badge={action.badge}
            />
          ))}
        </div>
      </section>

      {/* ─── Recent Auctions ─── */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Recent Auctions</h2>
          <button
            onClick={() => navigate("/dashboard/auctions")}
            className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 transition hover:text-sky-300"
          >
            View all <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-slate-950/[0.92] via-indigo-950/50 to-slate-950/[0.92] p-[1px] backdrop-blur-xl transition-all duration-500 hover:translate-y-[-2px] hover:border-sky-400/25 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.12),0_8px_40px_-12px_rgba(0,0,0,0.7),0_0_60px_-15px_rgba(56,189,248,0.18),0_0_100px_-20px_rgba(99,102,241,0.12)] hover:before:opacity-100">

          {/* ── Inner glass content wrapper ── */}
          <div className="relative rounded-[15px] bg-gradient-to-br from-white/[0.025] via-white/[0.01] to-slate-900/40 transition-all duration-500 group-hover:from-white/[0.04] group-hover:to-white/[0.015]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[15px]">

              {/* ─ foreground ambient orb — persists, stronger on hover ─ */}
              <div
                className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-sky-500/[0.07] blur-[70px] transition-all duration-500 group-hover:bg-sky-500/[0.14] group-hover:blur-[55px] group-hover:-top-16 group-hover:-right-6"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-500/[0.07] blur-[70px] transition-all duration-500 group-hover:bg-indigo-500/[0.14] group-hover:blur-[55px] group-hover:-bottom-6 group-hover:-left-6"
                aria-hidden="true"
              />

              {/* ─ second-tier accent orbs — zero opacity by default, reveal on hover ─ */}
              <div
                className="absolute top-1/2 -right-8 h-28 w-28 -translate-y-1/2 rounded-full bg-violet-500/0 blur-[50px] transition-all duration-700 group-hover:bg-violet-500/[0.07] group-hover:blur-[40px]"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-1/3 left-1/4 h-20 w-20 rounded-full bg-emerald-500/0 blur-[45px] transition-all duration-700 group-hover:bg-emerald-500/[0.05] group-hover:blur-[35px]"
                aria-hidden="true"
              />

              {/* ─ neon left + right edge highlight lines ─ */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-sky-500/0 to-transparent transition-all duration-500 group-hover:via-sky-400/30" aria-hidden="true" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-indigo-400/0 to-transparent transition-all duration-500 group-hover:via-indigo-400/30" aria-hidden="true" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/0 to-transparent transition-all duration-500 group-hover:via-sky-400/20" aria-hidden="true" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-400/0 to-transparent transition-all duration-500 group-hover:via-indigo-400/20" aria-hidden="true" />

              {/* ─ inner top highlight sweep ─ */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-sky-400/0 via-sky-400/15 to-sky-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />

              {/* ─ corner accent halos (subtle glow dots at 4 corners) ─ */}
              <div
                className="absolute top-0 left-0 h-12 w-12 rounded-full bg-sky-500/0 blur-[18px] transition-all duration-500 group-hover:bg-sky-500/[0.06]"
                aria-hidden="true"
              />
              <div
                className="absolute top-0 right-0 h-12 w-12 rounded-full bg-indigo-500/0 blur-[18px] transition-all duration-500 group-hover:bg-indigo-500/[0.06]"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-0 left-0 h-12 w-12 rounded-full bg-violet-500/0 blur-[18px] transition-all duration-500 group-hover:bg-violet-500/[0.05]"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-0 right-0 h-12 w-12 rounded-full bg-sky-500/0 blur-[18px] transition-all duration-500 group-hover:bg-sky-500/[0.04]"
                aria-hidden="true"
              />

              {/* ─ noise/grain texture ─ */}
              <div
                className="absolute inset-0 rounded-[15px] opacity-[0.025] mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                  backgroundSize: "256px 256px",
                }}
                aria-hidden="true"
              />
            </div>

            {/* ── content ── */}
            {loading ? (
              <div className="space-y-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 border-b border-white/[0.05] px-5 py-2.5 last:border-0">
                    <Skeleton className="h-4 w-[140px] rounded-full" />
                    <Skeleton className="h-4 flex-1 rounded" />
                    <Skeleton className="h-4 w-[140px] rounded" />
                    <Skeleton className="h-4 w-6 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <RecentActivityTable auctions={recentAuctions} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardHome() {
  return <HomeContent />;
}

export { DashboardHome, HomeContent };
