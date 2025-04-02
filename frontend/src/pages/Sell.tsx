import React, { useState } from "react";
import { Camera, Upload, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface UploadImageResponse {
  imageUrl: string;
  message?: string;
}

const uploadImage = async (file: File): Promise<string> => {
  const token = localStorage.getItem("jwtToken");
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("https://farm2market-pearl.vercel.app/api/products/image-upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data: UploadImageResponse = await response.json();
    if (response.ok) return data.imageUrl;
    throw new Error(data.message || "Image upload failed");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Image upload failed");
  }
};

const PRODUCT_CATEGORIES = [
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "dairy", label: "Dairy" },
  { value: "grains", label: "Grains" },
  { value: "other", label: "Other" },
];

export default function Sell() {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError("");
      const file = event.target.files?.[0];
      if (!file) throw new Error("No file selected");
      setLoading(true);
      setUploadProgress(10);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 300);

      const imageUrl = await uploadImage(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setImage(imageUrl);

      setTimeout(() => setLoading(false), 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    try {
      setError("");
      const file = e.dataTransfer.files?.[0];
      if (!file) throw new Error("No file dropped");
      setLoading(true);
      setUploadProgress(10);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 300);

      const imageUrl = await uploadImage(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setImage(imageUrl);

      setTimeout(() => setLoading(false), 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
      setLoading(false);
      setUploadProgress(0);
    }
  };

  interface ProductDetails {
    productName: string;
    price: string;
    unit: string;
    category: string;
    description: string;
    quantity: string;
    image: string | null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setError("");
      setLoading(true);
      if (!image || !productName || !price || !unit || !category || !description || !quantity) {
        setError("Please fill all the fields");
        setLoading(false);
        return;
      }
      const productDetails: ProductDetails = { productName, price, unit, category, description, quantity, image };
      const token = localStorage.getItem("jwtToken");
      const userId = localStorage.getItem("userId");

      const response = await fetch("https://farm2market-pearl.vercel.app/api/list-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          name: productDetails.productName,
          description: productDetails.description,
          category: productDetails.category,
          price: productDetails.price,
          unit: productDetails.unit,
          amount: productDetails.quantity,
          image_url: productDetails.image,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setLoading(false);
        toast.success("Product listed successfully!");
        navigate("/");
      } else {
        setError(data.message || "Product listing failed");
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-8 border border-emerald-100"
        >
          <div className="flex items-center mb-8">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-emerald-100 rounded-full p-2.5 mr-4"
            >
              <Upload className="w-6 h-6 text-emerald-600" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Sell Your Harvest</h2>
          </div>

          {/* Image Upload */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative border-2 ${isDragging ? "border-emerald-500 bg-emerald-50/50" : "border-dashed border-gray-300"} rounded-2xl p-8 mb-8 transition-all duration-300 overflow-hidden`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 to-transparent pointer-events-none" />
            {!image ? (
              <div className="text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Camera className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Drop Your Product Image</h3>
                <p className="text-sm text-gray-600 mb-6">Drag and drop here or click to upload</p>
                <label className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all cursor-pointer">
                  <Upload className="w-5 h-5 mr-2" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={image}
                  alt="Product"
                  className="w-full max-h-72 object-cover rounded-xl shadow-md"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Upload Progress */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8"
              >
                <div className="flex items-center mb-3">
                  <Loader2 className="w-5 h-5 text-emerald-600 animate-spin mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {uploadProgress < 100 ? "Uploading..." : "Upload Complete!"}
                  </span>
                  <span className="ml-auto text-xs text-gray-500">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200/50 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 px-5 py-4 rounded-xl mb-8 flex items-start shadow-sm"
              >
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Oops!</p>
                  <p className="text-sm">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Details Form */}
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <motion.input
                  whileFocus={{ borderColor: "#10b981" }}
                  type="text"
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm"
                  placeholder="e.g., Fresh Tomatoes"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <motion.select
                  whileFocus={{ borderColor: "#10b981" }}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </motion.select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <motion.input
                  whileFocus={{ borderColor: "#10b981" }}
                  type="number"
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <motion.select
                  whileFocus={{ borderColor: "#10b981" }}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="dozen">Dozen</option>
                  <option value="piece">Piece</option>
                  <option value="liter">Liter</option>
                  <option value="gram">Gram (g)</option>
                  <option value="quintal">Quintal</option>
                </motion.select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Quantity</label>
              <motion.input
                whileFocus={{ borderColor: "#10b981" }}
                type="number"
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <motion.textarea
                whileFocus={{ borderColor: "#10b981" }}
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm"
                rows={5}
                placeholder="Tell us about your product—quality, freshness, and more!"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(16, 185, 129, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-semibold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center disabled:bg-emerald-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  Listing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6 mr-2" />
                  List Your Product
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}