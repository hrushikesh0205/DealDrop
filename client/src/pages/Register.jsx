import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api/axios.js";
import Logo from "../assets/Logo_dark_theme.png";
import toast from "react-hot-toast";


function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {

        setError("");

        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        const { name, email, phone, password } = form;
        if (!name || !email || !phone || !password) {
            setError("All fields are required.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        try {
            setLoading(true);
            await API.post("/register", form);
            navigate("/login");
            toast.success("Account Created Successfully 🚀");
        } catch (e) {
            console.error(e);
            setError(e.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {/* noise overlay */}
            <div id="dd-noise" />
            <style>{`
                @keyframes _rg-in  { from{opacity:0;transform:translate3d(0,28px,0)} to{opacity:1;transform:translate3d(0,0,0)} }
                @keyframes _rg-bg1 {
                    0%,100%{transform:translate(-28%, 6%) scale(1.04);  opacity:.38}
                    50%    {transform:translate(-10%,-16%) scale(1.14); opacity:.54}
                }
                @keyframes _rg-bg2 {
                    0%,100%{transform:translate(6%, 10%)  scale(0.96);  opacity:.30}
                    44%    {transform:translate(-10%,-6%) scale(1.06); opacity:.44}
                }
                @keyframes _rg-bg3 {
                    0%,100%{transform:translate(24%, 14%) scale(1.01);  opacity:.20}
                    60%    {transform:translate(-12%,4%) scale(1.10);  opacity:.32}
                }
                ._rg-in  { animation:_rg-in  0.72s cubic-bezier(0.22,1,0.36,1) 0.08s both; }
                ._rg-bg1 { animation:_rg-bg1 26s ease-in-out infinite; }
                ._rg-bg2 { animation:_rg-bg2 20s ease-in-out 2s infinite; }
                ._rg-bg3 { animation:_rg-bg3 24s ease-in-out 5s infinite; }
            `}</style>

            <div className="relative flex min-h-screen items-center justify-center bg-[#030712] px-5 py-14">
                {/* background blobs */}
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                    <div
                        className="_rg-bg1 absolute left-[-24%] top-[-24%] h-[160%] w-[160%] rounded-[55%] blur-[140px]"
                        style={{ background: "radial-gradient(ellipse at 44% 44%,rgba(18,140,220,.30) 0%,rgba(52,30,190,.18) 50%,transparent 70%)" }}
                    />
                    <div
                        className="_rg-bg2 absolute left-[-6%] top-[-6%] h-[145%] w-[145%] rounded-[50%] blur-[120px]"
                        style={{ background: "radial-gradient(ellipse at 58% 58%,rgba(58,32,200,.26) 0%,rgba(12,118,214,.14) 46%,transparent 66%)" }}
                    />
                    <div
                        className="_rg-bg3 absolute right-[-10%] bottom-[-12%] h-[140%] w-[150%] rounded-[48%] blur-[120px]"
                        style={{ background: "radial-gradient(ellipse at 50% 50%,rgba(30,108,255,.16) 0%,transparent 60%)" }}
                    />
                </div>

                <div className="relative w-full max-w-[400px] space-y-8 _rg-in">
                    {/* ── brand + heading ── */}
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="relative">
                            <img
                                src={Logo}
                                alt="DealDrop"
                                className="relative z-10 h-12 w-12 rounded-xl object-cover ring-1 ring-white/10 shadow-[0_0_30px_rgba(20,135,255,.16)]"
                            />
                            <div
                                className="absolute -inset-1.5 z-0 rounded-2xl blur-[10px]"
                                style={{ background: "linear-gradient(135deg,rgba(20,170,255,.40),rgba(70,45,255,.30))" }}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <h2 className="text-[1.72rem] font-black tracking-[-0.02em] text-white">
                                Create your account
                            </h2>
                            <p className="text-[0.875rem] text-slate-400">
                                Join DealDrop — no credit card required, forever free.
                            </p>
                        </div>
                    </div>

                    {/* ── error alert ── */}
                    {error && (
                        <div
                            className="flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/[0.07] px-4 py-3.5 text-[0.8125rem] text-red-300"
                            role="alert"
                            aria-live="assertive"
                        >
                            <span className="mt-0.5 inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[0.625rem] font-black">
                                !
                            </span>
                            <p className="leading-relaxed">{error}</p>
                        </div>
                    )}

                    {/* ── form fields ── */}
                    <form onSubmit={handleSubmit} noValidate className="space-y-[0.9rem]">
                        {[
                            { name: "name", label: "Full name", placeholder: "Your full name", id: "rg-name", type: "text", autoComplete: "name" },
                            { name: "email", label: "Email address", placeholder: "you@company.com", id: "rg-email", type: "email", autoComplete: "email" },
                            { name: "phone", label: "Phone number", placeholder: "+91 98765 43210", id: "rg-phone", type: "tel", autoComplete: "tel" },
                            { name: "password", label: "Password", placeholder: "Min. 6 characters", id: "rg-pwd", type: "password", autoComplete: "new-password" },
                        ].map(({ name, label, placeholder, id, type, autoComplete }) => (
                            <div key={name} className="space-y-1.5">
                                <label
                                    htmlFor={id}
                                    className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-slate-500"
                                >{label}</label>
                                <input
                                    id={id}
                                    name={name}
                                    type={type}
                                    autoComplete={autoComplete}
                                    placeholder={placeholder}
                                    value={form[name]}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-[0.72rem] text-[0.875rem] text-white placeholder:text-slate-600 transition-colors outline-none focus:border-sky-500/70 focus:bg-white/[0.055] focus:shadow-[0_0_0_3px_rgba(20,170,255,0.14)]"
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer group relative mt-2 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-[#08a0e8] via-[#5c40ee] to-[#3c52e0] py-3 text-[0.875rem] font-semibold text-white shadow-[0_0_44px_rgba(20,130,255,.22)] transition-shadow duration-200 hover:shadow-[0_0_58px_rgba(78,46,255,.40)] active:scale-[0.985] disabled:opacity-50 disabled:shadow-none"
                        >
                            <span className="relative z-10 flex items-center gap-2.5">
                                {loading ? (
                                    <>
                                        <span className="relative h-4 w-4">
                                            <span className="absolute inset-0 animate-spin rounded-full border-[1.5px] border-white/25 border-t-white" />
                                        </span>
                                        Creating account…
                                    </>
                                ) : (
                                    "Create account"
                                )}
                            </span>
                        </button>
                    </form>

                    {/* ── divider ── */}
                    <div className="relative flex items-center gap-4 py-0.5">
                        <div className="h-px flex-1 bg-white/[0.06]" />
                        <span className="text-[0.62rem] uppercase tracking-[0.25em] text-slate-600">
                            already a member?
                        </span>
                        <div className="h-px flex-1 bg-white/[0.06]" />
                    </div>

                    {/* ── sign-in button ── */}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.025] py-3 text-[0.8125rem] font-semibold text-slate-300 ring-1 ring-inset ring-white/[0.04] transition-all duration-200 hover:bg-white/[0.055] hover:text-white hover:border-white/[0.18] active:scale-[0.985]"
                    >
                        Sign in to existing account
                    </button>

                    {/* ── legal ── */}
                    <p className="text-center text-[0.6875rem] leading-relaxed text-slate-600/70">
                        By creating an account you agree to our{" "}
                        <span className="text-slate-500">Terms of Service</span>{" "}
                        and{" "}
                        <span className="text-slate-500">Privacy Policy</span>.
                    </p>
                </div>
            </div>
        </>
    );
}

export { Register };
