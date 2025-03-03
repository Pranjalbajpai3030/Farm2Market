import React, { useState, useEffect } from "react";
import { Loader2, ShoppingCart, Star, Phone, X, Plus, Minus, Search, Filter, ChevronDown, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  amount: number;
  producer: string;
  image_url: string;
  rating: number;
  producerId: number;
};

type FilterOptions = {
  category: string;
  priceRange: string;
  minRating: number;
};

const ProductCard: React.FC<{
  product: Product;
  onAddToCart: (product: Product) => void;
}> = ({ product, onAddToCart }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {/* Product Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md">
            <div className="flex items-center">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-xs font-medium">{product.rating}</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                <p>{product.producer}</p>
              </div>
            </div>
            <div className="bg-emerald-50 text-emerald-700 font-medium px-2.5 py-1 rounded-lg text-sm">
              ₹{product.price}/{product.unit}
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {product.description || "Fresh produce directly from the farm to your table."}
          </p>

          {/* Buttons */}
          <div className="mt-4 flex justify-between items-center gap-2">
            <button
              className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-1.5" />
              Add to Cart
            </button>
            <button
              className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                toast.success(`Contacting: ${product.producer}`);
              }}
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-1.5 shadow-md z-10 hover:bg-gray-100 transition-colors"
                onClick={() => setShowDetails(false)}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-xl mb-4"
                />
                <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-xs font-medium">{product.rating}</span>
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.description || "Fresh produce directly from the farm to your table. Grown with care and harvested at peak freshness to ensure the best quality and taste."}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Farmer</p>
                  <p className="font-medium">{product.producer}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium text-emerald-700">₹{product.price}/{product.unit}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Available Stock</p>
                  <p className="font-medium">{product.amount} {product.unit}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Product ID</p>
                  <p className="font-medium">#{product.id}</p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                  onClick={() => {
                    onAddToCart(product);
                    setShowDetails(false);
                  }}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <button
                  className="py-3 px-4 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center"
                  onClick={() => toast.success(`Contacting: ${product.producer}`)}
                >
                  <Phone className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Market: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loader, setLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [filters, setFilters] = useState<FilterOptions>({
    category: "",
    priceRange: "",
    minRating: 0
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("jwtToken");
      const category = ""; // Set category if needed

      try {
        const response = await fetch(
          "https://farm2market-pearl.vercel.app/api/get-products",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              category: category,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products. Try logging in again.");
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred while fetching products.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    
    // Simulate cart count for demo
    setCartCount(Math.floor(Math.random() * 5));
  }, []);

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowCartModal(true);
  };

  const handleCartSubmit = async () => {
    if (!selectedProduct) return;
    setLoader(true);

    const token = localStorage.getItem("jwtToken");

    try {
      const response = await fetch(
        "https://farm2market-pearl.vercel.app/api/add-to-cart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: selectedProduct.id,
            quantity: quantity,
            farmer_id: selectedProduct.producerId,
          }),
        }
      );

      if (response.status === 400) {
        toast.error("Product is already in your cart.");
      } else if (response.ok) {
        toast.success("Product added to cart successfully!");
        setCartCount(prev => prev + 1);
      }

      setShowCartModal(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while adding to cart.");
      }
    } finally {
      setLoader(false);
      setShowCartModal(false);
    }
  };

  const handleFilterChange = (filterType: keyof FilterOptions, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const applyFilters = () => {
    // This function is called when the "Apply Filters" button is clicked
    // The filters are already applied in the filteredProducts calculation
    toast.success("Filters applied successfully!");
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      priceRange: "",
      minRating: 0
    });
    toast.success("Filters reset");
  };

  const filteredProducts = products.filter(product => {
    // Apply search filter
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.producer.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Apply category filter
    if (filters.category && product.name.toLowerCase().indexOf(filters.category.toLowerCase()) === -1) {
      return false;
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (max) {
        if (product.price < min || product.price > max) return false;
      } else {
        // Handle "200+" case
        if (product.price < min) return false;
      }
    }
    
    // Apply rating filter
    if (filters.minRating > 0 && product.rating < filters.minRating) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="max-w-full min-h-screen pb-12">
    
      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full md:w-auto md:flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products or farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full md:w-auto justify-center"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white rounded-lg shadow-sm p-4 mb-6 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="dairy">Dairy</option>
                    <option value="grains">Grains</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <select 
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  >
                    <option value="">Any Price</option>
                    <option value="0-50">₹0 - ₹50</option>
                    <option value="50-100">₹50 - ₹100</option>
                    <option value="100-200">₹100 - ₹200</option>
                    <option value="200+">₹200+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select 
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
                  >
                    <option value="0">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button 
                  onClick={resetFilters}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={applyFilters}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
            <p className="text-gray-600">Loading fresh produce...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-6 max-w-lg mx-auto">
            <p className="font-medium mb-1">Error</p>
            <p className="text-sm">{error}</p>
            <button className="mt-2 text-sm text-red-700 underline">Try Again</button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 inline-flex rounded-full p-4 mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We couldn't find any products matching your search or filters. Try adjusting your criteria.
            </p>
            {(filters.category || filters.priceRange || filters.minRating > 0) && (
              <button 
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <h2 className="text-xl font-semibold text-gray-800">Fresh Produce ({filteredProducts.length})</h2>
              <div className="text-sm text-gray-600 flex flex-wrap gap-2">
                {filters.category && (
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full flex items-center">
                    Category: {filters.category}
                    <button 
                      onClick={() => handleFilterChange('category', '')}
                      className="ml-1 text-emerald-700 hover:text-emerald-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.priceRange && (
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full flex items-center">
                    Price: {filters.priceRange.replace('-', ' - ₹')}
                    <button 
                      onClick={() => handleFilterChange('priceRange', '')}
                      className="ml-1 text-emerald-700 hover:text-emerald-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.minRating > 0 && (
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full flex items-center">
                    Rating: {filters.minRating}+ stars
                    <button 
                      onClick={() => handleFilterChange('minRating', 0)}
                      className="ml-1 text-emerald-700 hover:text-emerald-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(filters.category || filters.priceRange || filters.minRating > 0) && (
                  <button 
                    onClick={resetFilters}
                    className="text-gray-500 hover:text-gray-700 underline text-xs"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add to Cart Modal */}
      <AnimatePresence>
        {showCartModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCartModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-1.5 shadow-md z-10 hover:bg-gray-100 transition-colors"
                onClick={() => setShowCartModal(false)}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center mb-4">
                <div className="bg-emerald-100 rounded-full p-2 mr-3">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Add to Cart</h2>
              </div>
              
              <div className="flex items-center mb-4">
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-20 h-20 object-cover rounded-lg mr-4"
                />
                <div>
                  <h3 className="font-medium text-gray-800">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-600">{selectedProduct.producer}</p>
                  <p className="text-emerald-700 font-medium mt-1">₹{selectedProduct.price}/{selectedProduct.unit}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity ({selectedProduct.unit})
                  </label>
                  <span className="text-xs text-gray-500">
                    Available: {selectedProduct.amount} {selectedProduct.unit}
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    className="bg-gray-200 hover:bg-gray-300 rounded-lg p-2 transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= selectedProduct.amount) {
                        setQuantity(value);
                      }
                    }}
                    className="w-16 mx-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    min="1"
                    max={selectedProduct.amount}
                  />
                  <button
                    className="bg-gray-200 hover:bg-gray-300 rounded-lg p-2 transition-colors"
                    onClick={() => setQuantity(Math.min(selectedProduct.amount, quantity + 1))}
                    disabled={quantity >= selectedProduct.amount}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-lg font-semibold">₹{(selectedProduct.price * quantity).toFixed(2)}</span>
              </div>
              
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                  onClick={handleCartSubmit}
                  disabled={loader}
                >
                  {loader ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  className="py-3 px-4 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setShowCartModal(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Market;