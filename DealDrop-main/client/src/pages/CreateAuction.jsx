import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/axios.js";

function CreateAuction() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        startingPrice: "",
        startTime: "",
        endTime: "",
        image: null
    });

    const [preview, setPreview] = useState(null);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // 🔥 Validation
        if (!form.title || !form.startingPrice || !form.startTime || !form.endTime) {
            return alert("Please fill all required fields");
        }

        if (!form.image) {
            return alert("Please upload an image");
        }

        try {
            const data = new FormData();

            data.append("title", form.title);
            data.append("description", form.description);
            data.append("startingPrice", form.startingPrice);
            data.append("startTime", form.startTime);
            data.append("endTime", form.endTime);
            data.append("image", form.image);

            await API.post("/createAuction", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            alert("Auction Created Successfully 🎉");

            navigate("/dashboard/auctions");

        } catch (e) {
            console.error(e);
            alert(e.response?.data?.message || "Failed to create auction");
        }
    }

    // 🔥 Cleanup preview memory
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    return (
        <section className="mx-auto max-w-4xl space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-8 text-white shadow-[0_24px_60px_rgba(20,184,166,0.3)] md:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                    Seller Tools
                </p>
                <h2 className="mt-2 text-4xl font-black tracking-tight">Create Auction</h2>
                <p className="mt-2 text-sm text-emerald-50 max-w-2xl">
                    Add compelling details, set your pricing rules, and upload high-quality images to attract bidders to your item.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_16px_50px_rgba(15,23,42,0.06)] md:p-10"
            >
                <div className="grid gap-8 md:grid-cols-2">

                    {/* Title */}
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Listing Title</label>
                        <input
                            name="title"
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                            placeholder="E.g., Vintage Rolex Submariner"
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Detailed Description</label>
                        <textarea
                            name="description"
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all min-h-[120px]"
                            placeholder="Describe the condition, features, and history of the item..."
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Starting Price (₹)</label>
                        <input
                            type="number"
                            name="startingPrice"
                            onChange={handleChange}
                            placeholder="0.00"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-black text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                        />
                    </div>

                    {/* Start Time */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Start Time</label>
                        <input
                            type="datetime-local"
                            name="startTime"
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                        />
                    </div>

                    {/* End Time */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">End Time</label>
                        <input
                            type="datetime-local"
                            name="endTime"
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="md:col-span-2 border-t border-slate-100 pt-8 mt-4">
                        <label className="mb-3 block text-sm font-semibold text-slate-700">Product Image</label>
                        
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-200 border-dashed rounded-[2rem] cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-teal-400 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-10 h-10 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="mb-2 text-sm text-slate-500"><span className="font-semibold text-teal-600">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setForm({ ...form, image: file });
                                            setPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                            </label>
                        </div> 

                        {form.image && (
                            <div className="mt-4 flex items-center bg-teal-50 text-teal-700 px-4 py-2 rounded-xl text-sm font-semibold border border-teal-100">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Selected: {form.image.name}
                            </div>
                        )}

                        {preview && (
                            <div className="mt-6 rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm relative group">
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-10 flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition-all duration-300 hover:scale-[1.02] hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    >
                        Publish Auction
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                </div>
            </form>
        </section>
    );
}

export { CreateAuction };