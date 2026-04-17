import { API } from "../api/axios";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { socket } from "../socket/socket";

function AuctionDetails() {
    const { id } = useParams();

    const [currentPrice, setCurrentPrice] = useState(0);
    const [bidAmount, setBidAmount] = useState("");
    const [rules, setRules] = useState(null);
    const [bids, setBids] = useState([]);
    const [auctionData, setAuctionData] = useState(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    useEffect(() => {
        fetchAuction();
        fetchBids();

        socket.connect();

        socket.on("connect", () => {
            setIsSocketConnected(true);
            socket.emit("join-auction", id);
            socket.emit("get-bid-rules", id);
        });

        socket.off("bid-update").on("bid-update", (data) => {
            if (data.auctionId === id) {
                setCurrentPrice(data.currentPrice);
                setBids((prev) => [
                    {
                        _id: Date.now().toString(), // temporary id for new socket bid
                        amount: data.currentPrice,
                        bidderId: { name: "Someone (Live)" },
                        createdAt: new Date().toISOString()
                    },
                    ...prev
                ]);
            }
        });

        socket.off("bid-rules").on("bid-rules", (data) => {
            if (data.auctionId === id) {
                setRules(data);
            }
        });

        socket.off("bid-error").on("bid-error", (msg) => {
            alert(msg); // fallback to alert or custom toast
        });

        return () => {
            socket.off("bid-update");
            socket.off("bid-rules");
            socket.off("bid-error");
            socket.off("connect");
        };
    }, [id]);

    function handleBid(e) {
        e.preventDefault();
        if (!bidAmount) return alert("Enter bid amount");

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
        } catch (e) {
            console.error("Failed to fetch auction", e);
        }
    }

    if (!auctionData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Simple Top Nav */}
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back to Auctions</span>
                        </Link>
                        <div className="text-xl font-extrabold text-gray-900 tracking-tight">
                            <span className="text-indigo-600">Deal</span>Drop
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left Column: Product Info */}
                    <div className="lg:w-2/3 space-y-8">
                        {/* Image Placeholder */}
                        <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-100 ring-1 ring-slate-200/50 shadow-2xl shadow-indigo-100/50 w-full min-h-[400px] sm:min-h-[500px]">
                            <div className="absolute top-6 left-6 z-10 flex items-center rounded-full bg-white/90 backdrop-blur-md px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-slate-800 shadow-xl border border-white/60">
                                {auctionData.status === "ENDED" ? (
                                    <><span className="mr-3 h-2 w-2 rounded-full bg-slate-400"></span>Ended</>
                                ) : (
                                    <><span className="mr-3 h-2 w-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]"></span>Live Auction</>
                                )}
                            </div>
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-900/20 to-transparent z-[5]"></div>
                            <img
                                src={auctionData?.image}
                                alt="auction"
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
                            />
                        </div>

                        {/* Title and Description */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{auctionData.title}</h1>
                            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed text-lg">
                                <p>{auctionData.description || "No detailed description available for this item."}</p>
                            </div>

                            {/* Rules / Constraints */}
                            {rules && (
                                <div className="mt-8 bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/50">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Bidding Rules
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                                            Minimum Bid: <span className="font-bold ml-1 text-gray-900">₹{rules.minBid}</span>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                                            Maximum Bid: <span className="font-bold ml-1 text-gray-900">₹{rules.maxBid}</span>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                                            Bid Multiple (Step): <span className="font-bold ml-1 text-gray-900">₹{rules.divisibleBy}</span>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Bidding Section */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-24 space-y-6">

                            {/* Bidding Panel */}
                            <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-gray-100 overflow-hidden">
                                <div className="bg-indigo-600 px-6 py-4">
                                    <h2 className="text-white font-bold text-lg">Current Price</h2>
                                    <div className="text-4xl font-black text-white mt-1">₹{currentPrice}</div>
                                </div>

                                <div className="p-6">
                                    {auctionData.status === "ENDED" ? (
                                        <div className="bg-green-50 rounded-2xl p-5 border border-green-200 text-center">
                                            <h3 className="text-xl font-bold text-green-800 mb-2 flex items-center justify-center">
                                                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4C11.955 8.944 14.5 12 18 12C20.5 12 21.5 15.5 21.5 18C21.5 20.5 18.5 22 15.5 22H6.5C3.5 22 2.5 18.5 2.5 15.5C2.5 12.5 5 10.5 7.5 10.5C9 10.5 11 11.5 11 11.5" />
                                                </svg>
                                                Auction Ended
                                            </h3>

                                            {auctionData.winnerId ? (
                                                <div className="mt-4 pt-4 border-t border-green-200/50">
                                                    <p className="text-sm text-green-700 uppercase tracking-wider font-bold mb-1">Winning Bidder</p>
                                                    <p className="text-lg font-extrabold text-green-900 capitalize">{auctionData.winnerId.name || "Anonymous user"}</p>
                                                    <p className="text-sm text-green-800 mt-2 bg-green-200/50 py-1.5 px-3 rounded-lg inline-block font-medium">Final Price: ₹{auctionData.currentPrice}</p>
                                                </div>
                                            ) : (
                                                <p className="mt-2 text-green-700 font-medium pb-2">No valid bids were placed.</p>
                                            )}
                                        </div>
                                    ) : (
                                        <form onSubmit={handleBid} className="space-y-4">
                                            <div>
                                                <label htmlFor="bid" className="block text-sm font-bold text-gray-700 mb-2">Your Bid (₹)</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 font-bold sm:text-lg">₹</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        id="bid"
                                                        placeholder={`Min: ₹${currentPrice + (rules?.divisibleBy || 1)}`}
                                                        value={bidAmount}
                                                        onChange={(e) => setBidAmount(e.target.value)}
                                                        className="block w-full pl-9 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-lg py-4 px-6 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 flex justify-center items-center"
                                            >
                                                Place Bid Now
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>

                            {/* Bid History */}
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-900">Bid History</h3>
                                    <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-full">{bids.length} bids</span>
                                </div>
                                <div className="p-0 max-h-[400px] overflow-y-auto">
                                    {bids.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">
                                            <svg className="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="font-medium text-sm">No bids have been placed yet.</p>
                                            {auctionData.status !== "ENDED" && <p className="text-xs mt-1">Be the first to bid!</p>}
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-gray-50">
                                            {bids.map((bid, index) => {
                                                const isWinner = bid.bidderId?._id === auctionData?.winnerId?._id && auctionData?.status === "ENDED";
                                                const isLatest = index === 0;

                                                return (
                                                    <li
                                                        key={bid._id || index}
                                                        className={`p-4 hover:bg-gray-50 transition-colors ${isWinner ? 'bg-green-50/50' : ''} ${isLatest && !isWinner ? 'bg-indigo-50/30' : ''}`}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-center">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${isWinner ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                                    {(bid.bidderId?.name || "U")[0].toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className={`font-bold ${isWinner ? 'text-green-800' : 'text-gray-900'} flex items-center`}>
                                                                        {bid.bidderId?.name || "Anonymous User"}
                                                                        {isWinner && <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full px-1.5 uppercase tracking-wider">Winner</span>}
                                                                        {isLatest && !isWinner && auctionData.status !== "ENDED" && <span className="ml-2 text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Highest</span>}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                                        {new Date(bid.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className={`font-black text-lg ${isWinner ? 'text-green-600' : 'text-gray-900'}`}>
                                                                ₹{bid.amount}
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

export { AuctionDetails };

