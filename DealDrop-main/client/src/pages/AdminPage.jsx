import { useEffect, useState } from "react";
import { API } from "../api/axios";

function AdminPage() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    async function fetchRequests() {
        const res = await API.get("/seller-requests");
        setRequests(res.data);
    }

    async function approve(userId) {
        await API.patch(`/approve-seller/${userId}`);
        fetchRequests();
    }

    async function reject(userId) {
        try {
            await API.patch(`/reject-seller/${userId}`);
            alert("Rejected ❌");
            fetchRequests();
        } catch (e) {
            alert("Failed to reject");
        }
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eef4ff,_#f8fafc_55%,_#ffffff)] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur">
                    <div className="border-b border-slate-100 bg-gradient-to-r from-slate-900 via-indigo-900 to-cyan-800 px-6 py-8 text-white sm:px-10">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-200">
                                    Admin Control
                                </p>
                                <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                                    Seller Approval Dashboard
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
                                    Review pending seller requests, inspect applicant details, and approve trusted accounts in one place.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:min-w-[320px]">
                                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-inner backdrop-blur-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-200">
                                        Pending
                                    </p>
                                    <p className="mt-2 text-3xl font-black">{requests.length}</p>
                                </div>
                                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-inner backdrop-blur-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-200">
                                        Status
                                    </p>
                                    <p className="mt-2 text-lg font-bold">
                                        {requests.length > 0 ? "Needs Review" : "All Clear"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-8 sm:px-10">
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                                    Seller Requests
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Approve verified users to let them publish auctions.
                                </p>
                            </div>

                            <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                                {requests.length} request{requests.length === 1 ? "" : "s"} in queue
                            </div>
                        </div>

                        {requests.length === 0 ? (
                            <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                                    <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="mt-5 text-xl font-bold text-slate-900">No pending requests</h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Everything is up to date. New seller applications will appear here automatically.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-5 lg:grid-cols-2">
                                {requests.map((user, index) => (
                                    <div
                                        key={user._id}
                                        className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                                    >
                                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-400 opacity-70" />

                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-lg font-black uppercase text-white shadow-lg">
                                                    {(user.name || user.email || "U")[0]}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">
                                                        Applicant {index + 1}
                                                    </p>
                                                    <h3 className="mt-1 text-xl font-extrabold text-slate-900">
                                                        {user.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        Awaiting seller access approval
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                                                Pending
                                            </span>
                                        </div>

                                        <div className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                                            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                                                <span className="font-semibold text-slate-500">Email</span>
                                                <span className="truncate text-right font-bold text-slate-900">
                                                    {user.email}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="font-semibold text-slate-500">User ID</span>
                                                <span className="max-w-[60%] truncate text-right font-mono text-xs text-slate-700">
                                                    {user._id}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <p className="text-sm text-slate-500">
                                                Approving this request will enable auction creation privileges.
                                            </p>

                                            <button
                                                onClick={() => approve(user._id)}
                                                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition-all duration-300 hover:scale-[1.02] hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Approve Seller
                                            </button>
                                            <button
                                                onClick={() => reject(user._id)}
                                                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition-all duration-300 hover:scale-[1.02] hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Reject Seller
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export { AdminPage };
