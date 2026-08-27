import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/axios.js";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { Textarea } from "../components/ui/textarea.jsx";
import { Label } from "../components/ui/label.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select.jsx";
import { Upload, X, Sparkles, Package, Tag, IndianRupee, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

//Auction Creation Page

function CreateAuction() {
    const navigate = useNavigate();
    const startTimeRef = useRef(null);
    const endTimeRef = useRef(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        startingPrice: "",
        startTime: "",
        endTime: "",
        category: "",
        image: null
    });
    const [preview, setPreview] = useState(null);
    const [recommendation, setRecommendation] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = ["Electronics", "Fashion", "Home", "Sports", "Jewellery", "Paintings", "Others"];

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, []);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        setRecommendation(null);
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    }

    function handleSelectChange(value) {
        setForm({ ...form, category: value });
        if (errors.category) {
            setErrors({ ...errors, category: null });
        }
    }

    function handleImageChange(e) {

        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif"
        ];

        if (!allowedTypes.includes(file.type)) {

            toast.error("Only image files are allowed");

            e.target.value = "";

            return;
        }

        if (file.size > 10 * 1024 * 1024) {

            toast.error("Image size must be under 10MB");

            e.target.value = "";

            return;
        }

        setForm({
            ...form,
            image: file
        });

        setPreview(URL.createObjectURL(file));

        if (errors.image) {
            setErrors({
                ...errors,
                image: null
            });
        }
    }

    function removeImage() {
        setForm({ ...form, image: null });
        setPreview(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        const newErrors = {};
        if (!form.title.trim()) newErrors.title = "Title is required";
        if (!form.description.trim()) newErrors.description = "Description is required";
        if (!form.startingPrice) newErrors.startingPrice = "Starting price is required";
        const divisibleBy = 5;

        if (Number(form.startingPrice) % divisibleBy !== 0) {
            newErrors.startingPrice =
                `Starting price must be in multiples of ₹${divisibleBy}`;
        }
        if (!form.startTime) newErrors.startTime = "Start time is required";
        if (!form.endTime) newErrors.endTime = "End time is required";
        if (!form.image) newErrors.image = "Please upload an image";
        if (!form.category) newErrors.category = "Category is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            const data = new FormData();
            data.append("title", form.title.charAt(0).toUpperCase() + form.title.slice(1));
            data.append("description", form.description);
            data.append("startingPrice", form.startingPrice);
            data.append(
                "startTime",
                new Date(form.startTime).toISOString()
            );

            data.append(
                "endTime",
                new Date(form.endTime).toISOString()
            );
            data.append("category", form.category);
            data.append("image", form.image);

            await API.post("/createAuction", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log(data);
            navigate("/dashboard/auctions");
            toast.success("Auction Created Successfully 🎯");
        } catch (e) {
            toast.error(
                e.response?.data?.message ||
                "Failed to create auction"
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    async function getRecommendation() {
        if (!form.title || !form.category) return;

        try {
            const res = await API.get(
                `/recommend-price?title=${form.title}&category=${form.category}`
            );
            setRecommendation(res.data);
            toast.success("Recommended Price Generated 📈");
        } catch (e) {
            console.error("Recommendation error:", e);
        }
    }

    async function generateAI() {
        if (!form.title || !form.category) {
            return;
        }

        try {
            const res = await API.post(
                "/generate-description",
                {
                    title: form.title,
                    category: form.category
                }
            );

            setForm({
                ...form,
                description: res.data.description
            });
            toast.success("AI Description Generated 🤖");
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    return (
        <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl font-bold tracking-tight text-white">Create Auction</h1>
                <p className="text-sm text-slate-500 mt-1">
                    List your item with premium visibility and smart pricing tools.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 blur-3xl" />
                        <div className="border-b border-white/10 px-5 py-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-white">
                                <Tag className="h-4 w-4 text-sky-400" />
                                Item Details
                            </div>
                        </div>
                        <div className="relative p-5 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-xs font-medium text-slate-400">Category</Label>
                                    <Select value={form.category} onValueChange={handleSelectChange}>
                                        <SelectTrigger
                                            id="category"
                                            className={`cursor-pointer bg-white/5 border-white/10 text-white ${errors.category ? "border-destructive" : ""
                                                }`}
                                        >
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>

                                        <SelectContent className="bg-slate-950 border-white/10">
                                            {categories.map(c => (
                                                <SelectItem
                                                    key={c}
                                                    value={c}
                                                    className="
                    cursor-pointer 
                    text-white
                    hover:bg-white/40
                    focus:bg-white/40
                    data-[highlighted]:bg-white/40
                    transition-colors
                    duration-200
                "
                                                >
                                                    {c}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-xs font-medium text-slate-400">Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="e.g., Vintage Rolex Submariner"
                                        className={`bg-white/5 border-white/10 text-white placeholder:text-slate-500 ${errors.title ? "border-destructive" : ""}`}
                                    />
                                    {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="description" className="text-xs font-medium text-slate-400">Description</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={generateAI}
                                        disabled={!form.title || !form.category}
                                        className="cursor-pointer h-6 px-2 text-xs text-sky-400 hover:bg-white/10 hover:text-sky-300"
                                    >
                                        <Sparkles className="mr-1 h-3 w-3" />
                                        AI Generate
                                    </Button>
                                </div>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Describe condition, featudescrires, and history..."
                                    rows={4}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 blur-3xl" />
                        <div className="border-b border-white/10 px-5 py-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-white">
                                <IndianRupee className="h-4 w-4 text-emerald-400" />
                                Pricing & Timing
                            </div>
                        </div>
                        <div className="relative p-5 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="startingPrice" className="text-xs font-medium text-slate-400">Starting Price (₹)</Label>
                                    <Input
                                        id="startingPrice"
                                        name="startingPrice"
                                        type="number"
                                        step="5"
                                        value={form.startingPrice}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className={`bg-white/5 border-white/10 text-white placeholder:text-slate-500 ${errors.startingPrice ? "border-destructive" : ""}`}
                                    />
                                    {errors.startingPrice && <p className="text-xs text-destructive">{errors.startingPrice}</p>}
                                </div>

                                <div
                                    className="space-y-2 cursor-pointer"
                                    onClick={() => startTimeRef.current?.showPicker()}
                                >
                                    <Label
                                        htmlFor="startTime"
                                        className="text-xs font-medium text-slate-400"
                                    >
                                        Start Time
                                    </Label>

                                    <Input
                                        ref={startTimeRef}
                                        id="startTime"
                                        name="startTime"
                                        type="datetime-local"
                                        value={form.startTime}
                                        onChange={handleChange}
                                        className={`bg-white/5 border-white/10 text-white [color-scheme:dark] cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer ${errors.startTime ? "border-destructive" : ""
                                            }`}
                                    />

                                    {errors.startTime && (
                                        <p className="text-xs text-destructive">
                                            {errors.startTime}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div
                                className="space-y-2 cursor-pointer"
                                onClick={() => endTimeRef.current?.showPicker()}
                            >
                                <Label
                                    htmlFor="endTime"
                                    className="text-xs font-medium text-slate-400"
                                >
                                    End Time
                                </Label>

                                <Input
                                    ref={endTimeRef}
                                    id="endTime"
                                    name="endTime"
                                    type="datetime-local"
                                    value={form.endTime}
                                    onChange={handleChange}
                                    className={`bg-white/5 border-white/10 text-white [color-scheme:dark] cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer ${errors.endTime ? "border-destructive" : ""
                                        }`}
                                />

                                {errors.endTime && (
                                    <p className="text-xs text-destructive">
                                        {errors.endTime}
                                    </p>
                                )}
                            </div>

                            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-white">AI Price Suggestion</p>
                                        <p className="text-xs text-slate-500">Smart pricing recommendations</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={getRecommendation}
                                        disabled={!form.title || !form.category}
                                        className="cursor-pointer h-7 text-xs border-white/20 bg-white/5 text-sky-400 hover:bg-white/10 hover:text-sky-300"
                                    >
                                        Suggest
                                    </Button>
                                </div>

                                {recommendation && (
                                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                        <div className="rounded bg-white/5 p-2.5 border border-white/10">
                                            <p className="text-xs text-slate-500">Suggested Start</p>
                                            <p className="text-sm font-bold text-white">₹{recommendation.suggestedStartingPrice}</p>
                                        </div>
                                        <div className="rounded bg-white/5 p-2.5 border border-white/10">
                                            <p className="text-xs text-slate-500">Expected Final</p>
                                            <p className="text-sm font-bold text-white">₹{recommendation.expectedFinalPrice}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                        <div className="border-b border-white/10 px-5 py-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-white">
                                <ImageIcon className="h-4 w-4 text-violet-400" />
                                Product Image
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center justify-center w-full">
                                <Label
                                    htmlFor="image-upload"
                                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors ${errors.image ? "border-destructive" : "border-white/20"
                                        }`}
                                >
                                    <Upload className="h-8 w-8 text-slate-500 mb-2" />
                                    <p className="text-xs text-slate-500">
                                        <span className="font-medium text-sky-400">Upload</span> or drag & drop
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                                </Label>
                                <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>

                            {errors.image && <p className="text-xs text-destructive">{errors.image}</p>}

                            {form.image && (
                                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2.5">
                                    <span className="text-xs font-medium text-white truncate max-w-48">{form.image.name}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={removeImage}
                                        className="cursor-pointer h-6 w-6 text-slate-400 hover:text-white hover:bg-white/10"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            )}

                            {preview && (
                                <div className="rounded-xl overflow-hidden border border-white/10">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-48 object-contain"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Summary</h3>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Title</span>
                                <span className="font-medium text-white truncate max-w-32">{form.title || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Category</span>
                                <span className="font-medium text-white">{form.category || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Starting Bid</span>
                                <span className="font-medium text-white">₹{form.startingPrice || "0"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Image</span>
                                <span className="font-medium text-white">{form.image ? "Uploaded" : "—"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Tips</h3>
                        <ul className="space-y-1 text-xs text-slate-500">
                            <li>• Clear, well-lit photos</li>
                            <li>• Detailed descriptions</li>
                            <li>• Competitive pricing</li>
                            <li>• Right category selection</li>
                        </ul>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <Button type="submit" disabled={isSubmitting} className="cursor-pointer w-full sm:w-auto bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-0 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-shadow">
                        {isSubmitting ? "Publishing..." : "Publish Auction"}
                        <Package className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}

export { CreateAuction };