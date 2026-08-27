import { AuthContext } from "../context/authContext.jsx";
import { useContext, useState, useEffect } from "react";
import { API } from "../api/axios.js";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/Logo_dark_theme.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

function Home() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAuctions();
    }, []);

    async function fetchAuctions() {
        setLoading(true);
        try {
            const res = await API.get("/auctions");
            setAuctions(res.data);
        } catch (e) {
            toast.error("Failed to load auctions");
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function requestSeller() {
        try {
            const res = await API.post("/request-seller");
            toast.success(res.data.message);
        } catch (e) {
            toast.error(e.response?.data?.message);
        }
    }

    const upcomingAuctions = auctions.filter(a => a.status === "UPCOMING");

    return (
        <div className="min-h-screen bg-black text-white">
            {/* NAVIGATION */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-2xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="relative">

                            {/* glow behind logo */}
                            <div className="absolute -inset-1 -z-10 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 opacity-25 blur-md" />

                            <img
                                src={Logo}
                                alt="DealDrop"
                                className="
            relative
            z-10
            h-10
            w-10
            rounded-xl
            object-cover
            ring-1
            ring-white/10
        "
                            />
                        </div>
                        <span className="text-xl font-black tracking-tight text-white">DealDrop</span>
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        <Link to="/dashboard" className="text-sm text-slate-300 transition hover:text-white">Home</Link>
                        <Link
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                document
                                    .getElementById("auctions")
                                    ?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="text-sm text-slate-300 transition hover:text-white"
                        >
                            Auctions
                        </Link>
                        <Link to="/login" className="text-sm text-slate-300 transition hover:text-white">My Bids</Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <div className="hidden text-right md:block">
                                    <p className="text-xs text-slate-400">Welcome back,</p>
                                    <p className="text-sm font-semibold text-white">{user.username || user.name}</p>
                                </div>
                                <Button
                                    onClick={logout}
                                    variant="ghost"
                                    className="border border-white/10 bg-white/5 text-white hover:bg-white/20 hover:text-sky-100 transition-all duration-200"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="border border-white/10 bg-white/5 text-white hover:bg-white/20 hover:text-sky-100 transition-all duration-200"
                                >
                                    <Link to="/login">Login</Link>
                                </Button>
                                <Button
                                    asChild
                                    className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-indigo-400"
                                >
                                    <Link to="/register">Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative overflow-hidden min-h-[85vh] flex items-center">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-indigo-500/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.15),transparent_40%),radial-gradient(circle_at_80%_40%,rgba(99,102,241,0.15),transparent_40%)]" />

                <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
                    <div className="text-center">
                        <Badge variant="secondary" className="mb-8 bg-sky-500/10 text-sky-300 border-sky-500/20">
                            Premium Online Auctions
                        </Badge>

                        <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                            Bid. Win. Save Big.
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
                            Discover exclusive items at incredible prices. Join thousands of bidders in our transparent,
                            secure auction platform built for the modern collector.
                        </p>

                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button
                                size="lg"
                                onClick={() => document.getElementById("auctions")?.scrollIntoView({ behavior: "smooth" })}
                                className="cursor-pointer h-12 px-8 text-base font-semibold bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-xl shadow-sky-500/30 hover:from-sky-400 hover:to-indigo-400"
                            >
                                Explore Auctions
                            </Button>
                            {user?.role === "seller" && (
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => navigate("/create-auction")}
                                    className="h-12 px-8 text-base font-semibold border-white/20 bg-white/5 text-white hover:bg-white/20 hover:text-sky-100 transition-all duration-200"
                                >
                                    Create Auction
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="border-t border-white/5 bg-gradient-to-b from-black to-slate-950">
                <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                            Why DealDrop?
                        </h2>
                        <p className="mt-4 text-slate-400">Premium features for serious bidders and sellers</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            {
                                title: "Exclusive Inventory",
                                description: "Access rare collectibles, limited editions, and unique finds unavailable elsewhere.",
                                icon: "★",
                                gradient: "from-sky-500 to-cyan-500"
                            },
                            {
                                title: "Transparent Bidding",
                                description: "Real-time bidding with complete transparency. No hidden fees, no surprises.",
                                icon: "⚡",
                                gradient: "from-indigo-500 to-purple-500"
                            },
                            {
                                title: "Secure Transactions",
                                description: "End-to-end encryption and verified payments for your peace of mind.",
                                icon: "🔒",
                                gradient: "from-emerald-500 to-teal-500"
                            }
                        ].map((feature) => (
                            <Card
                                key={feature.title}
                                className="group border-white/10 bg-white/[0.02] transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20"
                            >
                                <CardContent className="p-8">
                                    <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                                    <p className="mt-3 text-slate-400 leading-relaxed">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* AUCTIONS SECTION */}
            <section id="auctions" className="border-t border-white/5 bg-black">
                <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                                Upcoming Auctions
                            </h2>
                            <p className="mt-2 text-slate-400">Current auctions start soon</p>
                        </div>

                    </div>

                    {loading ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <Card key={i} className="border-white/10 bg-white/[0.02]">
                                    <CardContent className="p-0">
                                        <Skeleton className="h-48 w-full rounded-t-xl" />
                                        <div className="p-6 space-y-3">
                                            <Skeleton className="h-5 w-3/4" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <Skeleton className="h-8 w-24" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : upcomingAuctions.length === 0 ? (
                        <Card className="border-dashed border-white/20 bg-white/[0.02]">
                            <CardContent className="flex flex-col items-center justify-center py-20">
                                <div className="mb-4 text-5xl">🎯</div>
                                <h3 className="text-xl font-semibold text-white">No active auctions</h3>
                                <p className="mt-2 text-slate-400">New auctions are added daily. Check back soon!</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {upcomingAuctions.slice(0, 6).map((auction) => (
                                <Card
                                    key={auction._id}
                                    className="group/card relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl transition-all duration-700 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)]"
                                >
                                    {/* multi-layer ambient glow */}
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.03] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
                                    <div className="pointer-events-none absolute -inset-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 opacity-0 blur-2xl group-hover/card:opacity-60 transition-opacity duration-700" />

                                    {/* subtle grid pattern overlay */}
                                    <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:24px_24px]" />

                                    <div className="relative">
                                        <div className="relative h-48 overflow-hidden bg-black/30">
                                            {auction.image ? (
                                                <img
                                                    src={auction.image}
                                                    alt={auction.title}
                                                    className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover/card:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                                                    <span className="text-4xl opacity-20">📦</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                                            {/* premium shimmer effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 translate-x-[-100%] group-hover/card:translate-x-[100%] group-hover/card:opacity-100 transition-all duration-1000 ease-out" />

                                            <Badge className="absolute top-3 right-3 z-10 bg-emerald-500/90 text-white backdrop-blur-xl shadow-lg">
                                                {auction.status}
                                            </Badge>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-white transition-colors group-hover/card:text-sky-300 line-clamp-1">
                                                {auction.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                                                {auction.description}
                                            </p>

                                            <div className="mt-6 flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs uppercase tracking-widest text-slate-500">Current Bid</p>
                                                    <p className="mt-1 text-2xl font-black text-white">₹{auction.currentPrice}</p>
                                                </div>
                                                <Button onClick={() => navigate(`/auction/${auction._id}`)} size="sm" className="cursor-pointer rounded-lg h-8 px-3 text-[11px] font-bold uppercase tracking-wider text-sky-400 hover:bg-white/10 hover:text-sky-300 transition-all group-hover/card:shadow-[0_4px_16px_rgba(56,189,248,0.25)]">
                                                    Bid Now
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* SELLER CTA */}
                    {user && user.role !== "seller" && (
                        <Card className="mt-16 border-sky-500/20 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent">
                            <CardContent className="flex flex-col items-center justify-between gap-6 p-8 sm:flex-row">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Want to become a seller?</h3>
                                    <p className="mt-1 text-slate-300">Start listing your items and reach thousands of buyers.</p>
                                </div>
                                <Button
                                    onClick={requestSeller}
                                    className="bg-white text-slate-900 hover:bg-slate-100"
                                >
                                    Request Access
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/5 bg-black">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid gap-12 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <Link to="/" className="flex items-center gap-3 mb-4">
                                <div className="relative">
    
    {/* glow behind logo */}
    <div className="absolute -inset-1 -z-10 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 opacity-25 blur-md" />

    <img
        src={Logo}
        alt="DealDrop"
        className="
            relative
            z-10
            h-10
            w-10
            rounded-xl
            object-cover
            ring-1
            ring-white/10
        "
    />
</div>
                                <span className="text-xl font-black text-white">DealDrop</span>
                            </Link>
                            <p className="max-w-md text-slate-400">
                                Premium online auction platform for collectors, enthusiasts, and bargain hunters.
                                Transparent bidding, secure transactions, exceptional deals.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Platform</h4>
                            <ul className="space-y-3">
                                <li><Link to="/dashboard" className="text-sm text-slate-300 hover:text-white transition">Browse Auctions</Link></li>
                                <li><Link to="/login" className="text-sm text-slate-300 hover:text-white transition">My Bids</Link></li>
                                {user?.role === "seller" && (
                                    <li><Link to="/create-auction" className="text-sm text-slate-300 hover:text-white transition">Create Auction</Link></li>
                                )}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Account</h4>
                            <ul className="space-y-3">
                                <li><Link to="/login" className="text-sm text-slate-300 hover:text-white transition">Login</Link></li>
                                <li><Link to="/register" className="text-sm text-slate-300 hover:text-white transition">Sign Up</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-white/5 pt-8 text-center">
                        <p className="text-xs text-slate-500">
                            © {new Date().getFullYear()} DealDrop. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export { Home };
