import { AuthContext } from "../context/authContext.jsx";
import { useContext, useState, useEffect } from "react";
import { API } from "../api/axios.js";
import { useNavigate, Link } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        fetchAuctions();
    }, []);

    async function fetchAuctions() {
        try {
            const res = await API.get("/auctions");
            setAuctions(res.data);
        } catch (e) {
            console.error(e);
        }
    }

    async function requestSeller() {
        try {
            const res = await API.post("/request-seller");
            alert(res.data.message);
        } catch (e) {
            alert(e.response?.data?.message);
        }
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_40%,_#f8fafc_100%)] text-slate-900 selection:bg-sky-100 selection:text-sky-900">
            <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
                <div className="w-full px-4 sm:px-6 lg:px-10">
                    <div className="flex min-h-20 items-center justify-between gap-4">
                        <Link
                            to="/"
                            className="text-3xl font-black tracking-tight text-slate-900 transition hover:text-sky-600"
                        >
                            DealDrop
                        </Link>

                        <div className="hidden flex-1 justify-center px-4 md:flex md:px-8">
                            <div className="w-full max-w-xl">
                                <div className="group relative">
                                    <input
                                        type="text"
                                        placeholder="Search live auctions..."
                                        className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-3 pr-12 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white"
                                    />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-hover:text-sky-600">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6">
                            {user ? (
                                <>
                                    <div className="hidden text-right sm:flex sm:flex-col">
                                        <span className="text-xs font-medium text-slate-500">
                                            Welcome back,
                                        </span>
                                        <span className="font-bold capitalize text-slate-900">
                                            {user.username}
                                        </span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="rounded-2xl bg-rose-50 px-5 py-2.5 font-semibold text-rose-600 transition hover:bg-rose-100"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="font-semibold text-slate-600 transition hover:text-sky-600"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="rounded-full bg-slate-900 px-6 py-2.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-lg"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                <section className="relative isolate overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.16),_transparent_28%)]" />
                    <div className="absolute inset-0 bg-slate-950/55" />
                    <img
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=80"
                        alt="Auction Banner"
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="relative mx-auto flex min-h-[34rem] w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
                        <div className="max-w-3xl">
                            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-white backdrop-blur-md">
                                Premium Auctions Daily
                            </span>
                            <h1 className="mt-6 text-4xl font-black tracking-tight text-white md:text-6xl md:leading-[1.05]">
                                Discover
                                <span className="block bg-gradient-to-r from-sky-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                                    Incredible Deals
                                </span>
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                                Bid on exclusive items with a faster, cleaner,
                                and more transparent experience built for modern
                                online auctions.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link
                                    to={user ? "/dashboard/auctions" : "/register"}
                                    className="rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-sky-100"
                                >
                                    Explore Auctions
                                </Link>
                                {user?.role === "seller" && (
                                    <button
                                        onClick={() => navigate("/create-auction")}
                                        className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                                    >
                                        Create Auction
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full px-4 py-16 sm:px-6 lg:px-10">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="rounded-[2rem] border border-indigo-100 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-1">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h3 className="mt-6 text-2xl font-bold text-slate-900">
                                Exclusive Items
                            </h3>
                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                Find rare collections and unique items you simply
                                will not find anywhere else.
                            </p>
                        </div>

                        <div className="rounded-[2rem] border border-cyan-100 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-1">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
                                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="mt-6 text-2xl font-bold text-slate-900">
                                Secure Bidding
                            </h3>
                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                A transparent auction flow designed to keep your
                                bids, account, and data safe.
                            </p>
                        </div>

                        <div className="rounded-[2rem] border border-emerald-100 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-1">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="mt-6 text-2xl font-bold text-slate-900">
                                Fast Delivery
                            </h3>
                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                Win your auction and move quickly from bidding
                                to delivery with less friction.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="w-full px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
                    <div className="mb-10 flex flex-col gap-5 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.35em] text-sky-500">
                                Live Now
                            </span>
                            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                                Upcoming Auctions
                            </h2>
                        </div>
                        <button className="hidden text-sm font-bold text-sky-600 transition hover:text-sky-800 sm:block">
                            View All &rarr;
                        </button>
                    </div>

                    {auctions.length === 0 ? (
                        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-12 text-center shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
                            <svg className="mx-auto mb-4 h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <h3 className="text-xl font-bold text-slate-900">
                                No auctions available
                            </h3>
                            <p className="mt-2 text-slate-500">
                                Check back later for exciting new deals.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
                            {auctions.map((auction) => (
                                <div
                                    key={auction._id}
                                    onClick={() => navigate(`/auction/${auction._id}`)}
                                    className="group flex cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-[0_16px_50px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1.5 hover:border-sky-200 hover:shadow-[0_24px_60px_rgba(14,165,233,0.12)]"
                                >
                                    <div className="relative h-60 overflow-hidden">
                                        <div className="absolute left-4 top-4 z-10 flex items-center rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                                            <span className={`mr-2 h-2 w-2 rounded-full ${auction.status === "ENDED" ? "bg-slate-500" : "bg-rose-500 animate-pulse"}`}></span>
                                            {auction.status || "Live"}
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/50 to-transparent z-[5]"></div>
                                        <img
                                            src={auction.image}
                                            alt={auction.title}
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <h3 className="truncate text-lg font-bold text-slate-900 transition-colors group-hover:text-sky-600">
                                            {auction.title}
                                        </h3>
                                        <p className="mt-2 line-clamp-2 flex-grow text-sm text-slate-500">
                                            {auction.description}
                                        </p>

                                        <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
                                            <div>
                                                <span className="block text-[10px] font-bold uppercase text-slate-400">
                                                    Current Bid
                                                </span>
                                                <span className="text-xl font-black text-sky-600">
                                                    â‚¹{auction.currentPrice}
                                                </span>
                                            </div>
                                            <div className="rounded-xl bg-sky-50 px-4 py-2 text-xs font-bold text-sky-600 transition-colors duration-300 group-hover:bg-sky-600 group-hover:text-white">
                                                Bid Now
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-10 flex flex-wrap gap-4">
                        <button
                            onClick={requestSeller}
                            className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-sky-600"
                        >
                            Want to become seller
                        </button>
                        {user?.role === "seller" && (
                            <button
                                onClick={() => navigate("/create-auction")}
                                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-900 transition hover:border-sky-200 hover:text-sky-600"
                            >
                                Create Auction
                            </button>
                        )}
                    </div>
                </section>
            </main>

            <footer className="mt-auto bg-slate-950 text-slate-300">
                <div className="w-full px-4 py-14 sm:px-6 lg:px-10">
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                        <div>
                            <h3 className="text-2xl font-black tracking-tight text-white">
                                <span className="text-sky-400">Deal</span>Drop
                            </h3>
                            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
                                Your destination for exclusive auctions,
                                collectible finds, and everyday deals with a
                                cleaner bidding experience.
                            </p>
                        </div>
                        <div>
                            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-white">
                                Quick Links
                            </h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/" className="transition hover:text-sky-400">Home</Link></li>
                                <li><a href="#" className="transition hover:text-sky-400">Live Auctions</a></li>
                                <li><a href="#" className="transition hover:text-sky-400">How it Works</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-white">
                                Contact Us
                            </h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li className="flex items-center">
                                    <svg className="mr-2 h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    support@dealdrop.com
                                </li>
                                <li className="flex items-center">
                                    <svg className="mr-2 h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    +1 (800) DEAL-DRP
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-10 border-t border-slate-800 pt-6 text-xs text-slate-500">
                        <p>Â© {new Date().getFullYear()} DealDrop Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export { Home };
