import { Outlet } from "react-router-dom";
import { Sidebar } from "./SideBar";
import { Topbar } from "./Topbar";

function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.14),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_52%,_#f6f8fc_100%)] text-slate-900">
            <Sidebar />

            <div className="relative flex min-h-screen flex-1 flex-col">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute left-10 top-16 h-40 w-40 rounded-full bg-sky-300/20 blur-3xl" />
                    <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-indigo-300/20 blur-3xl" />
                </div>

                <div className="relative flex flex-1 flex-col">
                    <Topbar />

                    <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <div className="mx-auto min-h-full max-w-7xl rounded-[2rem] border border-white/60 bg-white/75 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export {DashboardLayout};
