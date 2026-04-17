import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";

function DashboardAuctions() {
    const [auctions, setAuctions] = useState([]);
    const [filter, setFilter] = useState("ALL");

    const navigate = useNavigate();

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

    // ðŸ” Filter logic
    const filteredAuctions =
        filter === "ALL" ? auctions : auctions.filter((a) => a.status === filter);

    return (
        <section className="space-y-8">
            <div className="flex flex-col gap-5 rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">
                        Marketplace
                    </p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                        Auctions
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-slate-500">
                        Explore live, upcoming, and completed listings through a
                        cleaner bidding dashboard.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {["ALL", "LIVE", "UPCOMING", "ENDED"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === f
                                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {filteredAuctions.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center shadow-sm">
                    <p className="text-lg font-semibold text-slate-800">
                        No auctions found
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                        Try another filter or check back when new auctions go
                        live.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredAuctions.map((auction) => (
                        <div
                            key={auction._id}
                            onClick={() =>
                                navigate(`/auction/${auction._id}`)
                            }
                            className="group cursor-pointer overflow-hidden rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1.5 hover:border-sky-200 hover:shadow-[0_24px_60px_rgba(14,165,233,0.14)]"
                        >
                            <div className="relative mb-5 h-56 w-full overflow-hidden rounded-xl">
                                <img
                                    src={auction.image}
                                    alt={auction.title}
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                                <div className="absolute top-3 right-3 z-10">
                                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-sm border border-white/20 ${auction.status === "LIVE"
                                            ? "bg-emerald-500/90 text-white"
                                            : auction.status === "UPCOMING"
                                                ? "bg-amber-500/90 text-white"
                                                : "bg-slate-800/90 text-white"
                                        }`}>
                                        {auction.status}
                                    </span>
                                </div>
                            </div>

                            <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-900 transition group-hover:text-sky-700">
                                {auction.title}
                            </h3>

                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                                {auction.description}
                            </p>

                            <div className="mt-6 flex items-end justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                                        Current Bid
                                    </p>
                                    <span className="mt-2 block text-2xl font-black text-slate-900">
                                        Rs. {auction.currentPrice}
                                    </span>
                                </div>

                                <span className="text-sm font-semibold text-sky-600 transition group-hover:translate-x-1">
                                    View details
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export { DashboardAuctions };
