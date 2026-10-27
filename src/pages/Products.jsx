import React, { useState, useEffect, useContext, useMemo } from "react";
import API from "../services/api";
import { CartContext } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import {
  Loader2,
  Laptop,
  Smartphone,
  Grid,
  Shirt,
  Home,
  Dumbbell,
} from "lucide-react";

export default function Products({ searchTerm = "", lang = "ar" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToCart } = useContext(CartContext);
  const [wishlistIds, setWishlistIds] = useState([]);

  // حالات التقسيم على صفحات (Pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16; // عدد المنتجات في كل صفحة

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products");
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          lang === "ar"
            ? "فشل في جلب المنتجات، تأكد من تشغيل Backend."
            : "Failed to fetch products."
        );
        setLoading(false);
      }
    };
    fetchProducts();
  }, [lang]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await API.get("/wishlist");
        setWishlistIds(res.data.map((item) => item.productId));
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };
    fetchWishlist();
  }, []);

  // العودة للصفحة الأولى تلقائياً عند تغيير البحث أو التصنيف
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const categories = [
    { id: "All", labelAr: "الكل", labelEn: "All", icon: Grid },
    { id: "Clothes", labelAr: "الملابس", labelEn: "Clothes", icon: Shirt },
    {
      id: "Laptops & Tech",
      labelAr: "إلكترونيات",
      labelEn: "Laptops & Tech",
      icon: Laptop,
    },
    {
      id: "Mobiles",
      labelAr: "موبايلات",
      labelEn: "Mobiles",
      icon: Smartphone,
    },
    { id: "Home", labelAr: "أدوات منزلية", labelEn: "Home", icon: Home },
    { id: "Sports", labelAr: "رياضة", labelEn: "Sports", icon: Dumbbell },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.categoryName?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(product.categoryName?.toLowerCase());

      const matchesSearch =
        !searchTerm ||
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  // حسابات التقسيم (Pagination calculations)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* عنوان الصفحة */}
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        {lang === "ar" ? "منتجاتنا" : "Our Products"}
      </h1>

      {/* أزرار التصنيفات والفلترة */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {lang === "ar" ? cat.labelAr : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* عرض المنتجات أو رسالة عدم وجود نتائج */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-12">
          {lang === "ar"
            ? "لا توجد منتجات مطابقة لهذا التصنيف حالياً"
            : "No products available in this category"}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                isInitialWishlisted={wishlistIds.includes(product.id)}
                lang={lang}
              />
            ))}
          </div>

          {/* أزرار التنقل بين الصفحات (Pagination UI) */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 py-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
              >
                {lang === "ar" ? "السابق" : "Previous"}
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
              >
                {lang === "ar" ? "التالي" : "Next"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}