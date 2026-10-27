import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import API from "../services/api";

function ProductCard({
  product,
  addToCart,
  isInitialWishlisted,
  onRemoveFromWishlist,
  lang = "ar",
}) {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(isInitialWishlisted);

  useEffect(() => {
    setIsWishlisted(isInitialWishlisted);
  }, [isInitialWishlisted]);

  const toggleWishlist = async (e) => {
    e.stopPropagation(); // يمنع فتح صفحة التفاصيل عند النقر على القلب

    // الحصول على الـ productId الصحيح سواء كان الكائن منتج مباشر أو داخل wishlist item
    const targetProductId = product.productId || product.id;

    try {
      if (isWishlisted) {
        await API.delete(`/wishlist/${targetProductId}`);
        setIsWishlisted(false);
        // لو مبعوث دالة حذف من صفحة Wishlist.jsx ينادي عليها عشان الكارت يختفي فوراً
        if (onRemoveFromWishlist) {
          onRemoveFromWishlist(targetProductId);
        }
      } else {
        await API.post("/wishlist", { productId: targetProductId });
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };

  const t = {
    addToCart: lang === "ar" ? "إضافة إلى السلة" : "Add to Cart",
  };

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative group"
    >
      {/* زر المفضلة (Heart Icon) */}
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white dark:bg-gray-800 shadow-md hover:scale-110 transition-transform"
        title={lang === "ar" ? "المفضلة" : "Wishlist"}
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isWishlisted
              ? "text-red-500 fill-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </button>

      {/* صورة المنتج */}
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
        <img
          src={
            product.imageUrl ||
            product.pictureUrl ||
            "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* تفاصيل المنتج */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 h-10">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xl font-extrabold text-gray-900 dark:text-white">
            {product.price ? product.price.toFixed(0) : "0"} {lang === "ar" ? "ج.م" : "EGP"}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-2 rounded-xl transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            {t.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProductCard);
