import { useState } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const { name, email, phone, password } = form;

        if (!name || !email || !phone || !password) {
            return alert("All fields are mandatory");
        }

        try {
            setLoading(true);

            await API.post("/register", form);

            alert("Registered successfully ✅");
            navigate("/login");

        } catch (e) {
            console.error(e);
            alert(e.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-extrabold">D</span>
                    </div>
                    <h1 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
                        Create your account
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Join DealDrop and start exploring live auctions.
                    </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-6 sm:p-8">
                    <form onSubmit = {handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                Full name
                            </label>
                            <input
                                id="name"
                                type = "text"
                                name = "name"
                                placeholder="Enter name"
                                value = {form.name}
                                onChange = {handleChange}
                                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
                                ></input>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                type = "email"
                                name = "email"
                                placeholder="you@example.com"
                                value = {form.email}
                                onChange = {handleChange}
                                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
                                ></input>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                                Phone number
                            </label>
                            <input
                                id="phone"
                                type = "number"
                                name = "phone"
                                placeholder="Enter phone number"
                                value = {form.phone}
                                onChange = {handleChange}
                                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
                                ></input>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type = "password"
                                name = "password"
                                placeholder="Create password"
                                value = {form.password}
                                onChange = {handleChange}
                                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
                                ></input>
                        </div>

                        <div className="rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3">
                            <div className="flex items-center justify-between text-sm text-indigo-700">
                                <span className="font-medium">Form progress</span>
                                <span>{Math.round((Object.values(form).filter(Boolean).length / 4) * 100)}%</span>
                            </div>
                            <div className="mt-2 h-2 rounded-full bg-indigo-100 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                                    style={{ width: `${(Object.values(form).filter(Boolean).length / 4) * 100}%` }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full rounded-xl px-4 py-3 text-sm font-bold text-white shadow-md transition-all ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5"}`}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export {Register};
