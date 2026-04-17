import { useContext } from "react";
import { AuthContext } from "../context/authContext.jsx";
import { useState } from "react";
import { useEffect } from "react";
import { API } from "../api/axios.js"
import { Link } from "react-router-dom";

function Profile() {
    const [userData, setUserData] = useState(null);
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const res = await API.get("/me");
            setUserData(res.data);
        } catch (e) {
            console.error(e);
        }
    }

    async function requestSeller() {
        try {
            const res = await API.post("/request-seller");
            alert(res.data.message);
            fetchProfile();
        } catch (e) {
            alert(e.response?.data?.message);
        }
    }

    async function handleLogout()
    {
        logout();
        Navigate("/",{ replace : true });
    }

    if (!userData) return (
        <div className="rounded-[2rem] border border-slate-200 bg-white/80 px-6 py-12 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-500">
                Profile
            </p>
            <p className="mt-3 text-lg font-semibold text-slate-800">
                Loading your account...
            </p>
        </div>
    );

    return (
        <section className="mx-auto max-w-4xl space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-900 p-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.25)] md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/80">
                    Account Overview
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight">
                    Profile
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-200">
                    Review your personal details, account role, and seller
                    access status from one clean profile panel.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
                <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                    <h3 className="text-lg font-bold text-slate-900">
                        User Info
                    </h3>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                                Name
                            </p>
                            <p className="mt-2 text-lg font-semibold text-slate-900">
                                {userData.name}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                                Email
                            </p>
                            <p className="mt-2 break-all text-lg font-semibold text-slate-900">
                                {userData.email}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                                Phone
                            </p>
                            <p className="mt-2 text-lg font-semibold text-slate-900">
                                {userData.phone}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                                Role
                            </p>
                            <p className="mt-2 text-lg font-semibold capitalize text-slate-900">
                                {userData.role}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                    <h3 className="text-lg font-bold text-slate-900">
                        Access & Actions
                    </h3>
                    {userData.role !== "admin" &&(
                    <>
                    <div className="mt-5 rounded-3xl bg-gradient-to-br from-sky-50 to-indigo-50 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">
                            Seller Status
                        </p>
                        <p className="mt-3 text-2xl font-black capitalize text-slate-900">
                            {userData.sellerRequest}
                        </p>
                    </div>
                    </>
                    )}

                    <div className="mt-6 space-y-3">
                        {userData.role !== "seller" && userData.role !== "admin" && (
                            <button
                                onClick={requestSeller}
                                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
                            >
                                Request Seller Access
                            </button>
                        )}

                        <button onClick={handleLogout} className="block w-full rounded-2xl bg-rose-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-rose-600">Logout</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { Profile }
