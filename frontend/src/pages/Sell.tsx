import React, { useState } from "react";
import { Camera, Upload, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";

// Function to upload image
interface UploadImageResponse {
  imageUrl: string;
  message?: string;
}

const uploadImage = async (file: File): Promise<string> => {
  const token = localStorage.getItem("jwtToken");

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(
      "https://farm2market-pearl.vercel.app/api/products/image-upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data: UploadImageResponse = await response.json();
    if (response.ok) {
      return data.imageUrl;
    } else {
      throw new Error(data.message || "Image upload failed");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Image upload failed");
    } else {
      throw new Error("Image upload failed");
    }
  }
};

// Product categories matching the marketplace filters
const PRODUCT_CATEGORIES = [
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "dairy", label: "Dairy" },
  { value: "grains", label: "Grains" },
  { value: "other", label: "Other" }
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

  interface ImageUploadEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleImageUpload = async (event: ImageUploadEvent): Promise<void> => {
    try {
      setError("");
      const file = event.target.files?.[0];
      if (!file) {
        throw new Error("No file selected");
      }
      setLoading(true);
      setUploadProgress(10);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      const imageUrl = await uploadImage(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setImage(imageUrl); // Store the image URL after upload
      
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      setError((err as Error).message);
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
      if (!file) {
        throw new Error("No file dropped");
      }
      setLoading(true);
      setUploadProgress(10);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      const imageUrl = await uploadImage(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setImage(imageUrl);
      
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      setError((err as Error).message);
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
      if (
        !image ||
        !productName ||
        !price ||
        !unit ||
        !category ||
        !description ||
        !quantity
      ) {
        setError("Please fill all the fields");
        setLoading(false);
        return;
      }
      const productDetails: ProductDetails = {
        productName,
        price,
        unit,
        category,
        description,
        quantity,
        image: image,
      };
      const token = localStorage.getItem("jwtToken");
      const userId = localStorage.getItem("userId");
      
      const response = await fetch(
        "https://farm2market-pearl.vercel.app/api/list-products",
        {
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
            image_url: productDetails.image, // Image URL passed after upload
          }),
        }
      );

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
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden p-6 md:p-8"
        >
          <div className="flex items-center mb-6">
            <div className="bg-emerald-100 rounded-full p-2 mr-3">
              <Upload className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">List Your Product</h2>
          </div>

          {/* Image Upload */}
          <div 
            className={`border-2 ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-dashed border-gray-300'} rounded-xl p-6 text-center mb-8 transition-all duration-200`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!image ? (
              <>
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Upload Product Image</h3>
                <p className="text-sm text-gray-500 mb-4">Drag and drop your image here, or click to browse</p>
                
                <label className="inline-flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 mr-2" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </>
            ) : (
              <div className="relative">
                <img
                  src={image}
                  alt="Product"
                  className="w-full max-h-64 object-contain rounded-lg"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="flex items-center mb-2">
                  <Loader2 className="w-5 h-5 text-emerald-600 animate-spin mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {uploadProgress < 100 ? 'Uploading image...' : 'Upload complete!'}
                  </span>
                  <span className="ml-auto text-xs text-gray-500">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-start"
              >
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Details Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  placeholder="e.g., Fresh Tomatoes"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {PRODUCT_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="dozen">Dozen</option>
                  <option value="piece">Piece</option>
                  <option value="liter">Liter</option>
                  <option value="gram">Gram (g)</option>
                  <option value="quintal">Quintal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Quantity
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                rows={4}
                placeholder="Describe your product in detail. Include information about quality, freshness, harvesting method, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center disabled:bg-emerald-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    List Product
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}