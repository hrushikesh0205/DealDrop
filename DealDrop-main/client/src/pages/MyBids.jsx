import { useEffect, useState } from "react";
import {API} from "../api/axios";

function MyBids() {
    const [bids, setBids] = useState([]);

    useEffect(() => {
        fetchBids();
    }, []);

    async function fetchBids() {
        try {
            const res = await API.get("/my-bids");
            setBids(res.data);
        } catch (e) {
            console.error(e);
        }
    }

    function getStatus(bid) {
        const auction = bid.auctionId;

        if (!auction) return "Unknown";

        if (auction.status === "ENDED") {
            if (auction.winnerId === bid.bidderId) return "WON";
            return "LOST";
        }

        if (auction.highestBidder === bid.bidderId) return "WINNING";

        return "OUTBID";
    }

    return (
        <section className="space-y-8">
            <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">
                    Bid Center
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                    My Bids
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    Follow your bidding activity and quickly spot whether you
                    are ahead or need to respond.
                </p>
            </div>

            {bids.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center shadow-sm">
                    <p className="text-lg font-semibold text-slate-800">
                        No bids placed yet
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                        Once you place a bid, your auction activity will show up
                        here.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bids.map((bid) => {
                        const auction = bid.auctionId;
                        const status = getStatus(bid);

                        return (
                            <div
                                key={bid._id}
                                className="group flex flex-col gap-5 rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_24px_60px_rgba(14,165,233,0.12)] md:flex-row md:items-center md:justify-between"
                            >
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="text-xl font-bold tracking-tight text-slate-900">
                                            {auction?.title}
                                        </h3>
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                                            Active Bid
                                        </span>
                                    </div>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                                                Your Bid
                                            </p>
                                            <p className="mt-2 text-2xl font-black text-slate-900">
                                                Rs. {bid.amount}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-sky-50 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">
                                                Current Price
                                            </p>
                                            <p className="mt-2 text-2xl font-black text-slate-900">
                                                Rs. {auction?.currentPrice}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <span
                                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                            status === "WINNING"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : status === "OUTBID"
                                                ? "bg-rose-100 text-rose-700"
                                                : status === "WON"
                                                ? "bg-sky-100 text-sky-700"
                                                : "bg-slate-200 text-slate-700"
                                        }`}
                                    >
                                        {status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export {MyBids};
