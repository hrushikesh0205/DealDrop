function DashboardHome() {
    return (
        <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-900 px-6 py-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.32)] md:px-8 md:py-10">
            <div className="absolute -left-8 top-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />
            <div className="absolute bottom-0 right-20 h-28 w-28 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/80">
                    Welcome Back
                </p>
                <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
                    Welcome to Dashboard
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
                    Here you can manage auctions, monitor bids, and keep your
                    profile and selling activity organized from one focused
                    workspace.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/15">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                            Auctions
                        </p>
                        <p className="mt-3 text-2xl font-bold">
                            Browse live markets
                        </p>
                        <p className="mt-2 text-sm text-slate-200">
                            Discover active listings and upcoming opportunities
                            quickly.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/15">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                            Bids
                        </p>
                        <p className="mt-3 text-2xl font-bold">
                            Track your position
                        </p>
                        <p className="mt-2 text-sm text-slate-200">
                            See whether you are winning, outbid, or have already
                            closed the deal.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/15">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
                            Profile
                        </p>
                        <p className="mt-3 text-2xl font-bold">
                            Manage your account
                        </p>
                        <p className="mt-2 text-sm text-slate-200">
                            Keep your account details and seller access request
                            status in view.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export {DashboardHome};
