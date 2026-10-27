import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { CartContext } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { Loader2, ShoppingCart, Star, MessageSquarePlus } from "lucide-react";

export default function ProductDetails({ lang = "ar" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // حقول نموذج إضافة تقييم جديد
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const prodRes = await API.get(`/products/${id}`);
        setProduct(prodRes.data);

        const revRes = await API.get(`/products/${id}/reviews`);
        setReviews(revRes.data);

        const relatedRes = await API.get(`/products/${id}/related`);
        setRelatedProducts(relatedRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await API.post(`/products/${id}/reviews`, {
        rating: Number(rating),
        comment,
        userName: userName.trim() || (lang === "ar" ? "مستخدم" : "User"),
      });

      setReviews([response.data, ...reviews]);
      setComment("");
      setUserName("");
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-xl text-gray-500">
        Product not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      {/* زر العودة للمنتجات */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-600 dark:text-gray-300 hover:text-blue-600 font-semibold flex items-center gap-2 cursor-pointer transition-colors"
      >
        {lang === "ar" ? "← العودة للمنتجات" : "← Back to Products"}
      </button>

      {/* 1️⃣ الحاوية الأولى المحدودة: تفاصيل المنتج + التقييمات */}
      <div className="max-w-4xl mx-auto space-y-12">
        {/* تفاصيل المنتج الأساسية */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 md:p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex justify-center items-center bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4">
              <img
                src={product.imageUrl || product.pictureUrl}
                alt={product.name}
                className="w-full h-80 object-cover rounded-xl shadow"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {product.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
                  {product.description}
                </p>
              </div>

              <div className="space-y-6">
                <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                  {product.price ? product.price.toFixed(2) : "0.00"} EGP
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {lang === "ar" ? "إضافة إلى السلة" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* قسم التقييمات والآراء */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 md:p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            {lang === "ar" ? "تقييمات العملاء" : "Customer Reviews"}
          </h2>

          {/* نموذج كتابة تقييم جديد */}
          <form
            onSubmit={handleAddReview}
            className="mb-8 bg-gray-50 dark:bg-gray-700/40 p-6 rounded-xl border border-gray-200 dark:border-gray-600"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              {lang === "ar" ? "أضف تقييمك" : "Add a Review"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder={lang === "ar" ? "اسمك" : "Your Name"}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                <option value="4">⭐⭐⭐⭐ (4/5)</option>
                <option value="3">⭐⭐⭐ (3/5)</option>
                <option value="2">⭐⭐ (2/5)</option>
                <option value="1">⭐ (1/5)</option>
              </select>
            </div>
            <textarea
              rows="3"
              placeholder={
                lang === "ar"
                  ? "...اكتب رأيك في المنتج"
                  : "Write your review..."
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white mb-4"
              required
            ></textarea>
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-colors cursor-pointer shadow"
            >
              <MessageSquarePlus className="w-5 h-5" />
              {lang === "ar" ? "إرسال التقييم" : "Submit Review"}
            </button>
          </form>

          {/* عرض قائمة التقييمات */}
          {reviews.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-6">
              {lang === "ar"
                ? "!لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج"
                : "No reviews yet. Be the first to review!"}
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {rev.userName}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {rev.comment}
                  </p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2️⃣ 🚀 قسم المنتجات ذات الصلة: بره الحاوية المحدودة ليأخذ وسع الشاشة كاملاً */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700/60">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-2.5 h-7 bg-blue-600 rounded-full inline-block"></span>
            {lang === "ar" ? "منتجات قد تعجبك" : "Related Products"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                addToCart={addToCart}
                lang={lang}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
