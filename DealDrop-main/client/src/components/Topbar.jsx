import { useContext } from "react";
import { AuthContext } from "../context/authContext";

function Topbar() {
    const { logout } = useContext(AuthContext);

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 px-6 py-4 backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">
                        Live Workspace
                    </p>
                    <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Track auctions, monitor bids, and manage your account in one place.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm md:block">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                            Status
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-700">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_16px_rgba(34,197,94,0.55)]" />
                            Ready to manage
                        </p>
                    </div>

                    {/* <button
                        onClick={logout}
                        className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                        Logout
                    </button> */}
                </div>
            </div>
        </header>
    );
}

export {Topbar};
