import React, { useState } from "react";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast  from 'react-hot-toast';

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
    console.log(data.imageUrl);
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

  interface ImageUploadEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleImageUpload = async (event: ImageUploadEvent): Promise<void> => {
    try {
      setError("");
      const file = event.target.files?.[0];
      if (!file) {
        throw new Error("No file selected");
      }
      setLoading(true);

      const imageUrl = await uploadImage(file);
      setImage(imageUrl); // Store the image URL after upload
      setLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
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
      console.log(token);
      console.log(userId);
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
        alert("Product listed successfully!");
        navigate("/");
      } else {
        setError(data.message || "Product listing failed");
        setLoading(false);
      }
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
    toast("Product listed successfully!");
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold">List Your Product</h2>

      {/* Image Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Camera className="w-12 h-12 text-gray-400 mx-auto" />
        <p className="mt-2 text-sm text-gray-600">Upload product images</p>
        <input
          type="file"
          onChange={handleImageUpload}
          className="mt-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm"
        />
      </div>

      {/* Loader and Error Message */}
      {loading && (
        <div className="text-center mt-4 text-green-600">Loading...</div>
      )}
      {error && <div className="text-center mt-4 text-red-600">{error}</div>}

      {/* Product Details Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Fresh Tomatoes"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
             
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Fruits, Vegetables, etc."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option>kg</option>
              <option>dozen</option>
              <option>piece</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={4}
            placeholder="Describe your product..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Quantity
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          List Product
        </button>
      </form>
    </div>
  );
}
