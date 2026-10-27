import React, { useState, useEffect, useContext } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import { Loader2, Heart } from "lucide-react";

export default function Wishlist({ lang = "ar" }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // استدعاء دالة إضافة المنتج للسلة من الـ Context
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await API.get("/wishlist");
      setWishlist(response.data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white flex items-center justify-center gap-2">
        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
        {lang === "ar" ? "قائمة المفضلة" : "My Wishlist"}
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-12 text-lg">
          {lang === "ar" ? "قائمة المفضلة فارغة حالياً" : "Your wishlist is empty"}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
{wishlist.map((item) => (
  <ProductCard
    key={item.id}
    product={item.product || item}
    isInitialWishlisted={true}
    onRemoveFromWishlist={(removedId) => {
      setWishlist((prev) => prev.filter((i) => (i.product?.id || i.id) !== removedId));
    }}
    addToCart={addToCart}
    lang={lang}
  />
))}
        </div>
      )}
    </div>
  );
}