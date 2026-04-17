import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

function Sidebar() {
    const { user } = useContext(AuthContext);

    const linkClass = ({ isActive }) =>
        `block px-4 py-2 rounded-lg font-medium transition ${
            isActive
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
        }`;

    return (
        <aside className="w-72 shrink-0 border-r border-slate-200/70 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white shadow-2xl shadow-slate-950/20">
            <div className="flex h-full flex-col p-5">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-5 py-6 backdrop-blur-sm">
                    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />
                    <div className="absolute -bottom-8 left-8 h-20 w-20 rounded-full bg-indigo-500/20 blur-2xl" />
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/80">
                        Control Center
                    </p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                        DealDrop
                    </h2>
                    <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                        <p className="text-sm text-slate-300">Signed in as</p>
                        <p className="mt-1 text-lg font-semibold text-white">
                            {user?.name}
                        </p>
                        <p className="mt-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
                            {user?.role}
                        </p>
                    </div>
                </div>

                <nav className="mt-8 flex-1 space-y-2">
                    <NavLink
                        to="/dashboard" end
                        className={({ isActive }) =>
                            `${linkClass({ isActive })} group flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 ${
                                isActive
                                    ? "border-indigo-400/40 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-950/40"
                                    : "bg-white/5 text-slate-200 hover:border-white/10 hover:bg-white/10 hover:text-white"
                            }`
                        }
                    >
                        <span>Dashboard</span>
                        <span className="text-xs text-current/70 transition group-hover:translate-x-1">
                            Overview
                        </span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/auctions"
                        className={({ isActive }) =>
                            `${linkClass({ isActive })} group flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 ${
                                isActive
                                    ? "border-indigo-400/40 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-950/40"
                                    : "bg-white/5 text-slate-200 hover:border-white/10 hover:bg-white/10 hover:text-white"
                            }`
                        }
                    >
                        <span>Browse Auctions</span>
                        <span className="text-xs text-current/70 transition group-hover:translate-x-1">
                            Explore
                        </span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/bids"
                        className={({ isActive }) =>
                            `${linkClass({ isActive })} group flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 ${
                                isActive
                                    ? "border-indigo-400/40 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-950/40"
                                    : "bg-white/5 text-slate-200 hover:border-white/10 hover:bg-white/10 hover:text-white"
                            }`
                        }
                    >
                        <span>My Bids</span>
                        <span className="text-xs text-current/70 transition group-hover:translate-x-1">
                            Track
                        </span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/profile"
                        className={({ isActive }) =>
                            `${linkClass({ isActive })} group flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 ${
                                isActive
                                    ? "border-indigo-400/40 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-950/40"
                                    : "bg-white/5 text-slate-200 hover:border-white/10 hover:bg-white/10 hover:text-white"
                            }`
                        }
                    >
                        <span>Profile</span>
                        <span className="text-xs text-current/70 transition group-hover:translate-x-1">
                            Manage
                        </span>
                    </NavLink>

                    {user?.role === "seller" && (
                        <>
                            <div className="my-5 flex items-center gap-3">
                                <div className="h-px flex-1 bg-white/10" />
                                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                                    Seller
                                </p>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>
                            <NavLink
                                to="/dashboard/create"
                                className={({ isActive }) =>
                                    `${linkClass({ isActive })} group flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 ${
                                        isActive
                                            ? "border-emerald-400/40 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-950/40"
                                            : "bg-white/5 text-slate-200 hover:border-white/10 hover:bg-white/10 hover:text-white"
                                    }`
                                }
                            >
                                <span>Create Auction</span>
                                <span className="text-xs text-current/70 transition group-hover:translate-x-1">
                                    Launch
                                </span>
                            </NavLink>

                            <NavLink
                                to="/dashboard/my-auctions"
                                className={({ isActive }) =>
                                    `${linkClass({ isActive })} group flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 ${
                                        isActive
                                            ? "border-emerald-400/40 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-950/40"
                                            : "bg-white/5 text-slate-200 hover:border-white/10 hover:bg-white/10 hover:text-white"
                                    }`
                                }
                            >
                                <span>My Auctions</span>
                                <span className="text-xs text-current/70 transition group-hover:translate-x-1">
                                    Review
                                </span>
                            </NavLink>
                        </>
                    )}

                    {user?.role === "admin" && (
                        <>
                            <div className="my-5 flex items-center gap-3">
                                <div className="h-px flex-1 bg-white/10" />
                                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                                    Admin
                                </p>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>
                            <NavLink
                                to="/dashboard/requests"
                                className={({ isActive }) =>
                                    `${linkClass({ isActive })} group flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 ${
                                        isActive
                                            ? "border-amber-400/40 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-950/40"
                                            : "bg-white/5 text-slate-200 hover:border-white/10 hover:bg-white/10 hover:text-white"
                                    }`
                                }
                            >
                                <span>Seller Requests</span>
                                <span className="text-xs text-current/70 transition group-hover:translate-x-1">
                                    Review
                                </span>
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>
        </aside>
    );
}

export {Sidebar};
