import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import {
  Home,
  ShoppingBag,
  Gavel,
  User,
  PlusCircle,
  Package,
  ShieldCheck,
  Menu,
} from "lucide-react";
import Logo from "../assets/Logo_dark_theme.png";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const navItems = [
  {
    to: "/dashboard",
    end: true,
    label: "Dashboard",
    icon: Home,
    hint: "Overview",
    section: "main",
  },
  {
    to: "/dashboard/auctions",
    label: "Browse Auctions",
    icon: ShoppingBag,
    hint: "Explore",
    section: "main",
  },
  {
    to: "/dashboard/bids",
    label: "My Bids",
    icon: Gavel,
    hint: "Track",
    section: "main",
  },
  {
    to: "/dashboard/profile",
    label: "Profile",
    icon: User,
    hint: "Manage",
    section: "main",
  },
];

const sellerItems = [
  {
    to: "/dashboard/create",
    label: "Create Auction",
    icon: PlusCircle,
    hint: "Launch",
    section: "seller",
  },
  {
    to: "/dashboard/my-auctions",
    label: "My Auctions",
    icon: Package,
    hint: "Review",
    section: "seller",
  },
];

const adminItems = [
  {
    to: "/dashboard/requests",
    label: "Seller Requests",
    icon: ShieldCheck,
    hint: "Review",
    section: "admin",
  },
];

function NavItem({ item, onClick }) {
  const isActiveColor = item.section === "seller"
    ? "border-emerald-400/40 bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white shadow-[0_0_25px_rgba(16,185,129,0.35)]"
    : item.section === "admin"
    ? "border-amber-400/40 bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white shadow-[0_0_25px_rgba(245,158,11,0.35)]"
    : "border-sky-400/40 bg-gradient-to-r from-sky-500/90 to-indigo-500/90 text-white shadow-[0_0_25px_rgba(56,189,248,0.35)]";

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl border px-4 py-3 font-medium transition-all duration-200 ${
          isActive
            ? isActiveColor
            : "border-transparent bg-white/[0.03] text-slate-300 hover:border-white/10 hover:bg-white/[0.07] hover:text-white"
        }`
      }
    >
      <item.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
      <span className="flex-1">{item.label}</span>
      <span className="text-xs opacity-60 transition-all duration-200 group-hover:translate-x-0.5">
        {item.hint}
      </span>
    </NavLink>
  );
}

function SectionDivider({ label }) {
  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500">
          {label}
        </p>
        <div className="h-px flex-1 bg-white/10" />
      </div>
    </div>
  );
}

function SidebarContent({ onNavClick }) {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex h-full flex-col p-4">
      <NavLink
  to="/dashboard"
  className="flex items-center justify-center pb-6"
>
        <img
          src={Logo}
          alt="DealDrop"
          className="h-12 w-12 rounded-xl object-cover ring-1 ring-white/10 shadow-[0_0_20px_rgba(56,189,248,0.15)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(56,189,248,0.25)]"
        />

        </NavLink>

      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {navItems.map((item) => (
          <NavItem key={item.to} item={item} onClick={onNavClick} />
        ))}

        {user?.role === "seller" && (
          <>
            <SectionDivider label="Seller" />
            {sellerItems.map((item) => (
              <NavItem key={item.to} item={item} onClick={onNavClick} />
            ))}
          </>
        )}

        {user?.role === "admin" && (
          <>
            <SectionDivider label="Admin" />
            {adminItems.map((item) => (
              <NavItem key={item.to} item={item} onClick={onNavClick} />
            ))}
          </>
        )}
      </nav>
    </div>
  );
}

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 rounded-xl bg-white/[0.05] text-white backdrop-blur-md hover:bg-white/[0.1] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 border-r-0 bg-gradient-to-b from-slate-950 to-black p-0">
            <SidebarContent onNavClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:w-72">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-black/80 backdrop-blur-xl" />
        <div className="relative h-full border-r border-white/10">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}

export { Sidebar };