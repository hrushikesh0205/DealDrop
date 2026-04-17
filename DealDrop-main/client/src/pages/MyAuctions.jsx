import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";

function MyAuctions() {
    const [auctions, setAuctions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAuctions();
    }, []);

    async function fetchAuctions() {
        try {
            const res = await API.get("/my-auctions");
            setAuctions(res.data);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <section className="space-y-8">
            <div className="flex flex-col gap-5 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-indigo-500 via-indigo-600 to-sky-700 p-8 text-white shadow-[0_24px_60px_rgba(79,70,229,0.25)] lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/80">
                        Seller Center
                    </p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight">
                        My Auctions
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-indigo-100">
                        Manage your created listings, track active bids, and review ended auctions.
                    </p>
                </div>
            </div>

            {auctions.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center shadow-sm">
                    <p className="text-lg font-semibold text-slate-800">
                        No auctions created yet
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                        You haven't listed any items. Create a new auction to start selling!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {auctions.map((auction) => (
                        <div
                            key={auction._id}
                            onClick={() =>
                                navigate(`/auction/${auction._id}`)
                            }
                            className="group cursor-pointer overflow-hidden rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-[0_24px_60px_rgba(79,70,229,0.12)]"

                        >
                            <div className="relative">
                                <img
                                    src={auction.image}
                                    alt={auction.title}
                                    className="w-full h-48 object-cover rounded-2xl mb-4 transition duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 left-3">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${auction.status === "LIVE"
                                                ? "bg-emerald-500/90 text-white"
                                                : auction.status === "UPCOMING"
                                                    ? "bg-amber-500/90 text-white"
                                                    : "bg-slate-800/90 text-white"
                                            }`}
                                    >
                                        {auction.status}
                                    </span>
                                </div>
                            </div>

                            <h3 className="font-bold text-xl mb-2 text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                {auction.title}
                            </h3>

                            <p className="text-sm text-slate-500 mb-5 line-clamp-2 leading-relaxed">
                                {auction.description}
                            </p>

                            <div className="grid grid-cols-2 gap-3 mb-4 rounded-2xl bg-slate-50 p-3">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Price</p>
                                    <p className="font-black text-slate-900 mt-0.5">₹{auction.currentPrice}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Bids</p>
                                    <p className="font-black text-indigo-600 mt-0.5">{auction.bidCount || 0}</p>
                                </div>
                            </div>

                            {/* Winner logic if ended */}
                            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                                {auction.status === "ENDED" ? (
                                    <p className="text-sm font-semibold text-emerald-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Winner: {auction.winnerId?.name || "None"}
                                    </p>
                                ) : (
                                    <span className="text-sm font-semibold text-indigo-600 transition group-hover:translate-x-1 flex items-center">
                                        Manage Auction
                                        <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export { MyAuctions };