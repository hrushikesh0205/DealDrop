import { API } from "../api/axios";
import { useContext } from "react";
import { AuthContext } from "../context/authContext.jsx";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { socket } from "../socket/socket";
import { PlayCircle, Calendar, PauseCircle, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AuctionDetails() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [bidAmount, setBidAmount] = useState("");
    const [rules, setRules] = useState(null);
    const [bids, setBids] = useState([]);
    const [auctionData, setAuctionData] = useState(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [paying, setPaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");
    const [selectedImage, setSelectedImage] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAuction();
        fetchBids();
        socket.auth = {
            token: localStorage.getItem("token")
        };

        socket.connect();

        socket.on("connect", () => {

            setIsSocketConnected(true);

            socket.emit("join-auction", id);

            socket.emit("get-bid-rules", id);


        });

        socket.off("bid-update").on("bid-update", (data) => {

            if (data.auctionId === id) {

                setCurrentPrice(data.currentPrice);
                if (data.rules) {
                    setRules(data.rules);
                }

                const newBid = {
                    _id: Date.now().toString(),
                    amount: data.currentPrice,
                    bidderId: {
                        _id: data.bidderId,
                        name: data.bidderName
                    },
                    createdAt: new Date().toISOString()
                };

                setBids((prev) => {

                    if (prev.some(
                        (b) =>
                            b.amount === data.currentPrice &&
                            b.createdAt === data.createdAt
                    )) {
                        return prev;
                    }

                    return [newBid, ...prev];

                });

                if (data.bidderId === user?._id) {
                    toast.success("Bid Placed Successfully 🔥");
                }

            }

        });

        socket.off("bid-rules").on("bid-rules", (data) => {

            if (data.auctionId === id) {

                setRules(data);


            }

        });

        socket.off("bid-error").on("bid-error", (msg) => {

            toast.error(msg);

        });

        return () => {
            socket.off("bid-update");
            socket.off("bid-rules");
            socket.off("bid-error");
            socket.off("connect");
            socket.disconnect();
        };
    }, [id]);

    useEffect(() => {

        if (!auctionData) return;

        const interval = setInterval(() => {

            const now = new Date();

            let targetTime;

            if (auctionData.status === "UPCOMING") {
                targetTime = new Date(auctionData.startTime);
            }
            else if (auctionData.status === "LIVE") {
                targetTime = new Date(auctionData.endTime);
            }
            else {
                setTimeLeft("");
                return;
            }

            const diff = targetTime - now;

            if (diff <= 0) {

                clearInterval(interval);

                setTimeLeft("Updating...");

                fetchAuction();

                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft(
                `${hours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}:${seconds
                        .toString()
                        .padStart(2, "0")}`
            );

        }, 1000);

        return () => clearInterval(interval);

    }, [auctionData]);

    function handleBid(e) {
        e.preventDefault();
        if (!bidAmount || Number(bidAmount) <= 0) {
            toast.error("Invalid Bid");
            return;
        }

        socket.emit("place-bid", {
            auctionId: id,
            bidAmount: Number(bidAmount)
        });
        setBidAmount("");
    }

    async function fetchBids() {
        try {
            const res = await API.get(`/auction/${id}/bids`);
            setBids(res.data.bids || []);
        } catch (e) {
            console.error("Failed to fetch bids", e);
        }
    }

    async function fetchAuction() {
        try {
            const res = await API.get(`/auction/${id}`);
            setAuctionData(res.data);
            setCurrentPrice(res.data.currentPrice);
            if (res.data.images && res.data.images.length > 0) {
                setSelectedImage(0);
            }
        } catch (e) {
            console.error("Failed to fetch auction", e);
        }
    }

    async function handlePayment() {
        try {
            setPaying(true);
            console.log("PAY CLICKED");

            const res = await API.post("/create-order", {
                auctionId: id
            });

            console.log("ORDER:", res.data);

            const options = {
                key: "rzp_test_Sd8GYtb4F1KUFZ",
                amount: res.data.amount,
                currency: "INR",
                name: "DealDrop",
                description: "Auction Payment",
                order_id: res.data.id,

                modal: {
                    ondismiss: function () {
                        setPaying(false);
                        toast.error("Payment Cancelled");
                    }
                },

                handler: async function (response) {

                    try {

                        await API.post("/verify-payment", {
                            ...response,
                            auctionId: id
                        });

                        toast.success("Payment Successful 🎉");

                        await fetchAuction();

                    } catch (e) {

                        console.error("VERIFY ERROR:", e);

                        toast.error("Payment verification failed ❌");

                    } finally {

                        setPaying(false);

                    }
                }
            };

            if (!window.Razorpay) {
                toast.error("Razorpay not loaded ❌");
                setPaying(false);
                return;
            }

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (e) {
            console.error("PAY ERROR:", e);
            toast.error("Payment failed ❌");
            setPaying(false);
        }
    }

    if (!auctionData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-black to-slate-900">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-sky-500/20 blur-2xl animate-pulse"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-2 border-sky-400/30 border-t-sky-400"></div>
                </div>
            </div>
        );
    }

    const STATUS_CONFIG = {
        LIVE: {
            label: "Live",
            icon: PlayCircle,
            badgeClass:
                "relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white border border-emerald-300/40 backdrop-blur-xl shadow-lg shadow-emerald-500/25 hover:scale-105 hover:ring-2",
            glow: "from-emerald-500/20 to-teal-500/10",

        },
        UPCOMING: {
            label: "Upcoming",
            icon: Calendar,
            badgeClass:
                "relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white border border-amber-300/40 backdrop-blur-xl shadow-lg shadow-amber-500/25 hover:scale-105 hover:ring-2",
            glow: "from-amber-500/20 to-orange-500/10",
        },
        ENDED: {
            label: "Ended",
            icon: PauseCircle,
            badgeClass:
                "relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 text-white border border-slate-300/40 backdrop-blur-xl shadow-lg shadow-slate-500/25 hover:scale-105 hover:ring-2",
            glow: "from-slate-500/15 to-zinc-600/10",
        },
        PAID: {
            label: "Paid",
            icon: Users,
            badgeClass:
                "relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 text-white border border-sky-300/40 backdrop-blur-xl shadow-lg shadow-sky-500/25 hover:scale-105 hover:ring-2",
            glow: "from-sky-500/20 to-blue-600/10",
        },
    };

    const getStatusBadge = () => {
        const config = STATUS_CONFIG[auctionData.status] || STATUS_CONFIG.ENDED;
        const StatusIcon = config.icon;
        return (
            <Badge
                className={`flex items-center gap-1.5 border-0 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] backdrop-blur-xl shadow-lg ${config.badgeClass}`}
            >
                <StatusIcon className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    const images = auctionData.images && auctionData.images.length > 0
        ? auctionData.images
        : [auctionData.image || "https://via.placeholder.com/800"];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 font-sans text-slate-100 selection:bg-sky-500/30 selection:text-sky-100 relative overflow-hidden animate-in fade-in duration-700">
            {/* Decorative background glows */}
            <div className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-sky-500/10 blur-3xl"></div>
            <div className="pointer-events-none absolute top-1/3 -right-40 h-[32rem] w-[32rem] rounded-full bg-indigo-500/10 blur-3xl"></div>
            <div className="pointer-events-none absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/8 blur-3xl"></div>

            {/* Subtle grid pattern overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:24px_24px]"></div>

            {/* Top Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <button
                            type="button"
                            onClick={() => {
                                if (window.history.length > 1) {
                                    navigate(-1);
                                } else {
                                    navigate("/dashboard/auctions");
                                }
                            }}
                            className="cursor-pointer group flex items-center text-slate-400 hover:text-sky-300 transition-colors"
                        >
                            <span className="mr-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] group-hover:border-sky-400/40 group-hover:bg-sky-400/10 transition">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                            </span>

                            <span className="font-medium text-sm">
                                Go Back
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                    {/* Left Column - Product Showcase */}
                    <div className="lg:w-2/3 space-y-8">
                        {/* Premium Image Gallery */}
                        <Card className="group/gallery relative overflow-hidden rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.5)] p-0 transition-all duration-700 hover:border-white/20 hover:shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.1)]">
                            {/* multi-layer ambient glow */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.03] opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-700" />
                            <div className={`pointer-events-none absolute -inset-2 bg-gradient-to-br ${STATUS_CONFIG[auctionData.status]?.glow || "from-white/10 to-transparent"} opacity-0 blur-2xl group-hover/gallery:opacity-60 transition-opacity duration-700`} />

                            <div className="absolute top-5 left-5 z-10">
                                {getStatusBadge()}
                            </div>



                            {/* Main Image */}
                            <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden bg-black/30">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent z-10"></div>
                                <img
                                    src={images[selectedImage]}
                                    alt={auctionData?.title || "auction"}
                                    className="h-full w-full object-contain transition-transform duration-[1.5s] ease-out group-hover/gallery:scale-105"
                                />
                                {/* premium shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 translate-x-[-100%] group-hover/gallery:translate-x-[100%] group-hover/gallery:opacity-100 transition-all duration-1000 ease-out" />
                            </div>

                            {/* Thumbnail Gallery */}
                            {images.length > 1 && (
                                <div className="p-4 border-t border-white/5">
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedImage(idx)}
                                                className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx
                                                    ? 'border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                                                    : 'border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-contain" />
                                                {selectedImage === idx && (
                                                    <div className="absolute inset-0 bg-sky-400/20"></div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Product Details */}
                        <Card className="rounded-3xl border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-500 hover:bg-white/[0.06] hover:border-white/14">
                            <CardHeader className="p-6 sm:p-8 pb-4">
                                <CardTitle className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight transition-all duration-300 group-hover/gallery:text-sky-300">
                                    {auctionData.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="min-h-[180px] px-6 sm:px-8 pb-8">
                                <p className="text-slate-300/90 leading-relaxed text-base sm:text-lg transition-colors duration-300">
                                    {auctionData.description || "No detailed description available for this item."}
                                </p>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Right Column - Bidding Panel */}
                    <div className="lg:w-1/3">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            {/* Main Bidding Card */}
                            <Card className="rounded-3xl border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.4)] transition-all duration-500 hover:bg-white/[0.06] hover:border-white/14">
                                <CardHeader className="relative bg-gradient-to-br from-sky-500/20 via-indigo-500/15 to-transparent border-b border-white/10 px-6 py-5">
                                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl"></div>
                                    <div className="relative">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-200">Current Price</p>
                                        <div className="text-4xl sm:text-5xl font-black text-white mt-1 tracking-tight">
                                            ₹{Number(currentPrice).toLocaleString("en-IN")}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6">
                                    {/* Countdown Display */}
                                    <div className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 backdrop-blur mb-6 transition-all duration-300">
                                        {auctionData?.status === "UPCOMING" && (
                                            <>
                                                <p className="text-[10px] uppercase tracking-widest text-amber-200/80">Starts In</p>
                                                <p className="mt-1 text-2xl font-black text-amber-300 tracking-wider tabular-nums">{timeLeft}</p>
                                            </>
                                        )}
                                        {auctionData?.status === "LIVE" && (
                                            <>
                                                <p className="text-[10px] uppercase tracking-widest text-rose-200/80">Ends In</p>
                                                <p className="mt-1 text-2xl font-black text-rose-300 tracking-wider tabular-nums">{timeLeft}</p>
                                            </>
                                        )}
                                        {auctionData?.status === "ENDED" && (
                                            <>
                                                <p className="text-[10px] uppercase tracking-widest text-slate-400">Auction Status</p>
                                                <p className="mt-1 text-xl font-black text-rose-300">Auction Ended</p>
                                            </>
                                        )}
                                        {auctionData?.status === "PAID" && (
                                            <>
                                                <p className="text-[10px] uppercase tracking-widest text-emerald-200/80">Payment Status</p>
                                                <p className="mt-1 text-xl font-black text-emerald-300">Completed ✓</p>
                                            </>
                                        )}
                                    </div>




                                    {rules && (
                                        <div className="mb-4 grid grid-cols-2 overflow-hidden rounded-xl border border-sky-400/15 bg-sky-500/[0.06]">

                                            {/* MIN BID */}
                                            <div className="flex flex-col items-center justify-center py-2.5 text-center">
                                                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-slate-400">
                                                    Minimum Bid
                                                </p>

                                                <p className="mt-1 text-xl font-black tracking-[-0.03em] text-sky-300 tabular-nums">

                                                    ₹{Number(rules.minBid).toLocaleString("en-IN")}
                                                </p>
                                            </div>

                                            {/* MAX BID */}
                                            <div className="relative flex flex-col items-center justify-center py-2.5 text-center">

                                                {/* divider */}
                                                <div className="absolute left-0 top-1/2 h-8 w-px -translate-y-1/2 bg-white/10"></div>

                                                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-slate-400">
                                                    Maximum Bid
                                                </p>

                                                <p className="mt-1 text-xl font-black tracking-[-0.03em] text-rose-300 tabular-nums">
                                                    ₹{Number(rules.maxBid).toLocaleString("en-IN")}

                                                </p>
                                            </div>

                                        </div>
                                    )}
                                    {auctionData?.status === "LIVE" && (

                                        <form onSubmit={handleBid} className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 mb-2">
                                                    Your Bid (₹)
                                                </label>
                                                <Input
                                                    type="number"
                                                    placeholder="Place Bid..."
                                                    value={bidAmount}
                                                    step='5'
                                                    onChange={(e) => setBidAmount(e.target.value)}
                                                    className="w-full px-4 py-4 bg-slate-900/60 border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-sky-400/60 h-14 text-lg"
                                                    required
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                className="cursor-pointer w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold py-4 shadow-[0_10px_40px_rgba(56,189,248,0.35)] hover:shadow-[0_15px_50px_rgba(99,102,241,0.5)] transition-all hover:-translate-y-0.5 h-14 text-base"
                                            >
                                                Place Bid Now
                                            </Button>
                                        </form>
                                    )}

                                    {auctionData?.status === "UPCOMING" && (
                                        <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-4 text-center">
                                            <p className="text-sm text-amber-200 font-medium">Bidding hasn't started yet. Come back when it goes live!</p>
                                        </div>
                                    )}

                                    {auctionData?.status === "ENDED" && (
                                        <div className="space-y-4">
                                            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                                                <p className="text-[10px] uppercase tracking-widest text-emerald-200">Winning Bidder</p>
                                                <p className="mt-1 text-lg font-bold text-white">
                                                    {auctionData?.winnerId?.name || "Anonymous"}
                                                </p>
                                                <p className="mt-2 text-sm text-emerald-200/80">
                                                    Final Price: <span className="text-white font-bold">₹{auctionData.currentPrice}</span>
                                                </p>
                                            </div>

                                            {auctionData?.winnerId &&
                                                auctionData?.bidCount > 0 &&
                                                auctionData?.winnerId?._id === user?._id && (
                                                    <Button
                                                        onClick={handlePayment}
                                                        disabled={paying}
                                                        className="cursor-pointer w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3.5 shadow-[0_10px_40px_rgba(16,185,129,0.35)] hover:shadow-[0_15px_50px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-0.5 disabled:opacity-60 h-12 text-base"
                                                    >
                                                        {paying ? "Processing..." : "Pay Now 💳"}
                                                    </Button>
                                                )}
                                        </div>
                                    )}

                                    {auctionData?.status === "PAID" && (
                                        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-center">
                                            <p className="text-emerald-300 font-bold text-lg">Payment Completed ✓</p>
                                            <p className="text-xs text-emerald-200/70 mt-1">Thank you for your purchase!</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Bid History */}
                            <Card className="rounded-3xl border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-500 hover:bg-white/[0.06] hover:border-white/14">
                                <CardHeader className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                                    <CardTitle className="text-base font-bold text-white">Bid History</CardTitle>
                                    <Badge className="border-0 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.15em] bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-200">
                                        {bids.length} bids
                                    </Badge>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <div className="h-[140px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                        {bids.length === 0 ? (
                                            <div className="p-8 text-center text-slate-400">
                                                <svg className="w-10 h-10 mx-auto text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="font-medium text-sm text-slate-300">No bids placed yet.</p>
                                                {auctionData.status !== "ENDED" && (
                                                    <p className="text-xs mt-1 text-slate-500">Be the first to bid!</p>
                                                )}
                                            </div>
                                        ) : (
                                            <ul className="divide-y divide-white/5">
                                                {bids.map((bid, index) => {
                                                    const isWinner =
                                                        bid.bidderId?._id === auctionData?.winnerId?._id &&
                                                        auctionData?.status === "ENDED";
                                                    const isLatest = index === 0;

                                                    return (
                                                        <li
                                                            key={bid._id || index}
                                                            className={`p-4 transition-colors ${isWinner
                                                                ? "bg-emerald-500/10"
                                                                : isLatest
                                                                    ? "bg-sky-500/10"
                                                                    : "hover:bg-white/[0.03]"
                                                                }`}
                                                        >
                                                            <div className="flex justify-between items-center gap-3">
                                                                <div className="flex items-center min-w-0">
                                                                    <div
                                                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0 ${isWinner
                                                                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                                                                            : isLatest
                                                                                ? "bg-sky-500/20 text-sky-300 border border-sky-400/30"
                                                                                : "bg-white/[0.06] text-slate-300 border border-white/10"
                                                                            }`}
                                                                    >
                                                                        {(bid.bidderId?.name || "U")[0].toUpperCase()}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="font-bold text-white text-sm flex items-center flex-wrap gap-2 truncate">
                                                                            <span className="truncate">{bid.bidderId?.name || "Anonymous"}</span>
                                                                            {isWinner && (
                                                                                <span className="text-[9px] bg-emerald-500/90 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                                                                    Winner
                                                                                </span>
                                                                            )}
                                                                            {isLatest && !isWinner && auctionData.status !== "ENDED" && (
                                                                                <span className="text-[9px] bg-sky-500/90 text-white px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                                                                    Highest
                                                                                </span>
                                                                            )}
                                                                        </p>
                                                                        <p className="text-[11px] text-slate-400 mt-0.5 tabular-nums">
                                                                            {new Date(bid.createdAt).toLocaleTimeString([], {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                                second: "2-digit",
                                                                            })}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className={`font-black text-lg tabular-nums shrink-0 ${isWinner
                                                                        ? "text-emerald-300"
                                                                        : isLatest
                                                                            ? "text-sky-300"
                                                                            : "text-white"
                                                                        }`}
                                                                >
                                                                    ₹{Number(bid.amount).toLocaleString("en-IN")}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );


}

export { AuctionDetails };