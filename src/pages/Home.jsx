import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  ArrowRight,
  Headphones,
} from "lucide-react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";

export default function Home({ lang = "ar" }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await API.get("/products");
        // أخذ أول 4 منتجات فقط للعرض في الصفحة الرئيسية
        setFeaturedProducts(res.data.slice(0, 4));
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Banner (Centered) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 md:p-16 shadow-xl text-center">
        <div className="max-w-2xl mx-auto space-y-6 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            {lang === "ar"
              ? "مرحباً بك في متجرنا الإلكتروني"
              : "Welcome to Our E-Store"}
          </h1>
          <p className="text-blue-100 text-lg md:text-xl">
            {lang === "ar"
              ? "اكتشف أفضل المنتجات بأعلى جودة وأفضل الأسعار مع توصيل سريع!"
              : "Discover top-quality products at the best prices with fast shipping!"}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-100 font-bold px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{lang === "ar" ? "تسوق الآن" : "Shop Now"}</span>
          </Link>
        </div>
      </section>
      {/* Why Choose Us Section */}
      <section className="py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {lang === "ar" ? "لماذا تختارنا؟" : "Why Choose Us?"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: Fast Shipping */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/80 shadow-sm hover:shadow-xl dark:shadow-slate-900/50 transition-all duration-300 text-center group">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Truck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {lang === "ar" ? "شحن سريع" : "Fast Shipping"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {lang === "ar"
                ? "توصيل سريع لكافة المدن والمحافظات."
                : "Quick delivery across all cities."}
            </p>
          </div>

          {/* Feature 2: Secure Payment */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/80 shadow-sm hover:shadow-xl dark:shadow-slate-900/50 transition-all duration-300 text-center group">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {lang === "ar" ? "دفع آمن 100%" : "Secure Payment"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {lang === "ar"
                ? "خيارات دفع متعددة وآمنة تماماً."
                : "Multiple 100% safe payment options."}
            </p>
          </div>

          {/* Feature 3: 24/7 Support */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-gray-100 dark:border-slate-700/80 shadow-sm hover:shadow-xl dark:shadow-slate-900/50 transition-all duration-300 text-center group">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Headphones className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {lang === "ar" ? "دعم على مدار الساعة" : "24/7 Support"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {lang === "ar"
                ? "فريق خدمة العملاء جاهز لمساعدتك دائماً."
                : "Customer support team ready to help anytime."}
            </p>
          </div>
        </div>
      </section>
      {/* 3. Featured Products */}
      {!loading && featuredProducts.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              {lang === "ar" ? "أحدث المنتجات" : "Featured Products"}
            </h2>
            <Link
              to="/products"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
            >
              <span>{lang === "ar" ? "عرض الكل" : "View All"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                lang={lang}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
