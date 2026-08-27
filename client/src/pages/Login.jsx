import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { API } from "../api/axios.js";
import { AuthContext } from "../context/authContext.jsx";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo_dark_theme.png";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await API.post("/login", { email, password });
      login(res.data);
      if (res.data.role === "admin") { navigate("/admin"); } else { navigate("/dashboard"); }
      toast.success("Login Successful 🎉");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div id="dd-noise" />
      <style>{`
            @keyframes _l-h { from{opacity:0;transform:translate3d(0,24px,0)} to{opacity:1;transform:translate3d(0,0,0)} }
            @keyframes _l-p { from{opacity:0;transform:translate3d(0,16px,0)} to{opacity:1;transform:translate3d(0,0,0)} }
            @keyframes _l-f { from{opacity:0;transform:translate3d(0,30px,0)} to{opacity:1;transform:translate3d(0,0,0)} }
            @keyframes _l-l { from{opacity:0;transform:scale(0.89) translate3d(0,12px,0)} to{opacity:1;transform:scale(1) translate3d(0,0,0)} }
            @keyframes _l-s1{ 0%,100%{transform:translate(2px,14px) scale(1.05);opacity:.32} 50%{transform:translate(-56px,-22px) scale(1.14);opacity:.52} }
            @keyframes _l-s2{ 0%,100%{transform:translate(0px,-10px) scale(0.95);opacity:.26} 42%{transform:translate(72px,4px) scale(1.07);opacity:.44} }
            @keyframes _l-s3{ 0%,100%{transform:translate(18px,22px) scale(0.99);opacity:.20} 58%{transform:translate(-38px,-10px) scale(1.09);opacity:.32} }
            ._l-h { animation:_l-h 0.72s cubic-bezier(0.22,1,0.36,1) 0.20s both; }
            ._l-p { animation:_l-p 0.72s cubic-bezier(0.22,1,0.36,1) 0.28s both; }
            ._l-f { animation:_l-f 0.72s cubic-bezier(0.22,1,0.36,1) 0.10s both; }
            .l-l  { animation:_l-l 0.56s cubic-bezier(0.22,1,0.36,1) 0s    both; }
            ._l-s1{ animation:_l-s1 22s ease-in-out infinite; }
            ._l-s2{ animation:_l-s2 17s ease-in-out infinite; }
            ._l-s3{ animation:_l-s3 20s ease-in-out infinite; }
          `}</style>



      <div className="flex min-h-screen">

        {/* ─── LEFT: Brand hero (desktop only,unchanged) ─── */}

        <div className="hidden h-screen flex-col justify-between overflow-hidden bg-[#030712] px-10 py-10 lg:flex lg:w-[38%] xl:px-14">
          {/* Gradient blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="_l-s1 absolute left-[-22%] top-[2%] h-[120%] w-[160%] rounded-[60%] opacity-35 blur-[130px]"
              style={{ background: "radial-gradient(ellipse at 40% 40%,rgba(20,155,255,.28) 0%,rgba(55,35,210,.15) 48%,transparent 70%)" }} />
            <div className="_l-s2 absolute right-[-20%] bottom-[2%] h-[110%] w-[150%] rounded-[55%] opacity-30 blur-[110px]"
              style={{ background: "radial-gradient(ellipse at 62% 58%,rgba(65,38,200,.26) 0%,rgba(12,130,220,.12) 46%,transparent 68%)" }} />
            <div className="_l-s3 absolute left-[42%] top-[-20%] h-[130%] w-[140%] rounded-[50%] opacity-22 blur-[100px]"
              style={{ background: "radial-gradient(ellipse at 50% 50%,rgba(30,120,255,.18) 0%,transparent 60%)" }} />
          </div>

          {/* Logo badge — aligned to eyebrow-pill cap height */}
          <div className="pt-8 w-fit mx-auto">
            <div className="relative flex items-center justify-center ">
              <div
                className="absolute inset-0 rounded-xl blur-md opacity-70"
                style={{ background: "linear-gradient(135deg,rgba(20,170,255,.42),rgba(70,45,255,.34))" }}
              />
              <img src={Logo} alt="DealDrop"
                className="relative z-10 h-15 w-15 shrink-0 rounded-[0.625rem] object-cover ring-1 ring-white/10" />
            </div>
          </div>

          {/* Hero copy */}
          <div className="relative z-10 flex flex-col justify-end pt-0 pb-10">
            <div className="_l-h flex justify-center">
              <div className="mb-7 inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-400/[0.85]">
                Premium Auctions
              </div>
            </div>
            <h1 className="_l-h mt-3 text-[3.2rem] leading-[0.91] font-black tracking-[-0.035em] text-white xl:text-[3.6rem]">
              The marketplace<br />for live auctions.
            </h1>
            <p className="_l-p mt-5 max-w-xs text-[0.95rem] leading-[1.65] text-slate-400">
              Discover exclusive items, bid in real time, and win - all within a
              transparent, secure platform built for modern collectors.
            </p>
            <div className="_l-p mt-8 flex flex-col gap-2.5">
              {[
                ["⚡", "Real-time bidding with live updates"],
                ["🔒", "End-to-end encrypted transactions"],
                ["🌐", "Verified sellers and buyers only"],
              ].map(([ic, tx]) => (
                <div key={tx} className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.05] text-xs ring-1 ring-white/[0.08]">{ic}</span>
                  <span className="text-[0.82rem] text-slate-400">{tx}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="relative z-10 text-[0.7rem] text-slate-600/60">
            © {new Date().getFullYear()} DealDrop
          </p>
        </div>

        {/* ─── RIGHT: Auth form ─── */}
        <div className="flex w-full flex-col items-center justify-center px-5 py-14 md:px-10 lg:w-[62%]">
          <div className="relative w-full max-w-[400px]">

            {/* ─ Ambient side glow — binds form to left column ─ */}
            <div
              className="pointer-events-none absolute left-[-120px] top-1/2 h-[80%] w-[240px] -translate-y-1/2 rounded-full blur-[100px] opacity-50"
              style={{
                background: "radial-gradient(ellipse at 50% 50%,rgba(66,60,195,.30) 0%,rgba(10,120,240,.12) 60%,transparent 100%)",
                filter: "blur(80px)",
              }}
              aria-hidden="true"
            />

            {/* ─ Form card: dark glass surface ─ */}
            <div
              className="relative rounded-[1.35rem] border border-[rgba(255,255,255,0.055)]"
              style={{
                backgroundColor: "#0b1120",
                backgroundImage: "linear-gradient(135deg,rgba(255,255,255,.018) 0%,transparent 55%)",
                boxShadow: "0 0 0 1px rgba(255,255,255,.028) inset,0 24px 80px -16px rgba(0,0,0,.65),0 0 90px -20px rgba(80,48,255,.18)",
              }}
            >
              {/* flexure-reflection at the top */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] rounded-[1.35rem]"
                style={{ background: "linear-gradient(90deg,transparent,rgba(130,180,255,.13) 34%,rgba(180,130,255,.11) 68%,transparent)" }} />

              <div className="_l-f space-y-8 px-7 py-8 sm:px-9 sm:py-9">

                {/* Mobile brand */}
                <div className="flex items-center gap-2.5 lg:hidden">
                  <div className="relative">
                    <img src={Logo} alt="DealDrop"
                      className="relative z-10 h-8 w-8 rounded-lg object-cover ring-1 ring-white/10" />
                    <div className="absolute -inset-0.5 z-0 rounded-lg blur-[6px]"
                      style={{ background: "linear-gradient(135deg,rgba(20,170,255,.48),rgba(70,45,255,.38))" }} />
                  </div>
                  <span className="text-base font-black tracking-tight text-white">DealDrop</span>
                </div>

                {/* ── Section header ── */}
                <div className="space-y-1.5">
                  <h2 className="text-[1.65rem] font-black tracking-[-0.02em] text-white">
                    Welcome back
                  </h2>
                  <p className="text-[0.875rem] text-slate-400">
                    Sign in to continue to your DealDrop account
                  </p>
                </div>

                {/* ─ Error alert ─ */}
                {error && (
                  <div
                    className="flex items-start gap-2.5 rounded-xl border border-[rgba(200,40,45,.30)] bg-[rgba(200,38,40,.07)] px-4 py-3.5 text-[0.8125rem] text-red-300"
                    role="alert" aria-live="assertive"
                  >
                    <span className="mt-0.5 inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[0.625rem] font-black">!</span>
                    <p className="leading-relaxed">{error}</p>
                  </div>
                )}

                {/* ─ Form ─ */}
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email"
                      className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-slate-400/70">
                      Email address
                    </label>
                    <input
                      id="email" type="email" autoComplete="email"
                      placeholder="you@company.com" value={email}
                      onChange={(e) => {
                        setError("");
                        setEmail(e.target.value);
                      }}
                      className="block w-full rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.024)] px-4 py-[0.72rem] text-[0.875rem] text-white placeholder:text-slate-500 transition-colors outline-none focus:border-[rgba(107,99,255,.60)] focus:bg-[rgba(255,255,255,0.038)] focus:shadow-[0_0_0_3px_rgba(107,99,255,.14)]"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password"
                        className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-slate-400/70">
                        Password
                      </label>
                    </div>
                    <input
                      id="password" type="password" autoComplete="current-password"
                      placeholder="••••••••••" value={password}
                      onChange={(e) => {
                        setError("");
                        setPassword(e.target.value);
                      }}
                      className="block w-full rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.024)] px-4 py-[0.72rem] text-[0.875rem] text-white placeholder:text-slate-500 transition-colors outline-none focus:border-[rgba(107,99,255,.60)] focus:bg-[rgba(255,255,255,0.038)] focus:shadow-[0_0_0_3px_rgba(107,99,255,.14)]"
                    />
                  </div>

                  {/* CTA */}
                  <button
                    type="submit" disabled={isLoading}
                    className="cursor-pointer group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#08a0e8] via-[#5c40ee] to-[#3c52e0] py-3 text-[0.875rem] font-semibold text-white shadow-[0_0_44px_rgba(20,130,255,.22)] transition-all duration-200 hover:shadow-[0_0_58px_rgba(92,60,250,.38)] active:scale-[0.985] disabled:opacity-50 disabled:shadow-none"
                  >
                    <span className="relative z-10 flex items-center gap-2.5">
                      {isLoading ? (
                        <>
                          <span className="relative h-4 w-4">
                            <span className="absolute inset-0 animate-spin rounded-full border-[1.5px] border-white/25 border-t-white" />
                          </span>
                          Signing in…
                        </>
                      ) : "Sign in"}
                    </span>
                  </button>
                </form>

                {/* ─ Divider ─ */}
                <div className="relative flex items-center gap-4 pt-1">
                  <div className="h-px flex-1 bg-[rgba(255,255,255,0.055)]" />
                  <span className="text-[0.62rem] uppercase tracking-[0.25em] text-slate-500/55">or</span>
                  <div className="h-px flex-1 bg-[rgba(255,255,255,0.055)]" />
                </div>

                {/* ─ Sign-up secondary button ─ */}
                <Link
                  to="/register"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.022)] py-3 text-[0.8125rem] font-semibold text-slate-300 transition-all duration-200 hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white active:scale-[0.985]"
                >
                  Sign up for free
                </Link>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { Login };
