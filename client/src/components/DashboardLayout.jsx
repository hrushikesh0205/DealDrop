import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Sidebar } from "./Sidebar";
import { Button } from "./ui/button";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"

function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.15),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.15),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0b1120_55%,_#000000_100%)] text-slate-100 lg:flex-row">
      <Sidebar />

      <div className="relative flex min-h-screen flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-10 top-16 h-40 w-40 rounded-full bg-sky-500/15 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl" />
        </div>

        <header className="sticky top-0 z-40 border-b border-white/10 bg-white/[0.02] backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              {/* <div className="relative hidden max-w-md flex-1 lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search auctions, bids..."
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                />
              </div> */}
            </div>

            <div className="flex items-center gap-3">
              {/* <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl text-slate-400 hover:bg-white/[0.05] hover:text-white"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[10px] font-medium text-white">
                  3
                </span>
              </Button> */}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="cursor-pointer flex h-10 items-center rounded-2xl bg-white/[0.04] pr-4 pl-1 text-slate-300 transition-all duration-300 hover:bg-white/[0.12] hover:text-white hover:shadow-[0_0_15px_5px_rgba(139,92,246,0.3)]"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 font-semibold text-white shadow-lg">
                      {user?.name?.charAt(0) || "U"}
                    </div>

                    <span className="ml-2 text-sm font-semibold">
                      {user?.name || "User"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border border-violet-500/10 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-[0_0_20px_10px_rgba(139,92,246,0.05)] transition-all duration-300 ease-out data-[state=open]:scale-100 data-[state=open]:opacity-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 bg-clip-padding">
                  <DropdownMenuLabel className="flex flex-col space-y-4 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 font-medium text-white shadow-lg">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-slate-100">{user?.name}</p>
                        <p className="text-xs text-slate-400">{user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="h-px mx-4 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard/profile")}
                    className="cursor-pointer flex items-center gap-3 px-4 py-2 rounded-xl text-slate-200 hover:bg-white/[0.08] hover:text-white hover:shadow-[0_0_10px_2px_rgba(255,255,255,0.1)] transition-all duration-300"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="h-px mx-4 bg-gradient-to-r from-transparent via-red-500/10 to-transparent" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer flex items-center gap-3 px-4 py-2 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 hover:shadow-[0_0_10px_2px_rgba(255,99,71,0.2)] transition-all duration-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="mx-auto min-h-full max-w-7xl rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:rounded-[2rem] md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export { DashboardLayout };