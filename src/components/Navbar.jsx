import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Globe, Sun, Moon, Heart } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function Navbar({
  theme,
  toggleTheme,
  lang,
  toggleLang,
  searchTerm,
  setSearchTerm,
}) {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // التوجيه التلقائي لصفحة المنتجات عند الكتابة إذا لم يكن المستخدم فيها
    if (window.location.pathname !== "/products") {
      navigate("/products");
    }
  };

  const totalItemsCount = cartItems
    ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <nav className="w-full bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* اللوجو والروابط الرئيسية */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            E-Store
          </Link>

          {/* روابط التنقل */}
          <div className="hidden md:flex items-center gap-6 font-medium">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <Link to="/products" className="hover:text-blue-400 transition-colors">
              {lang === "ar" ? "المنتجات" : "Products"}
            </Link>
          </div>
        </div>

        {/* شريط البحث */}
        <div className="hidden md:flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 w-64">
          <Search className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={
              lang === "ar" ? "ابحث عن منتج..." : "Search for a product..."
            }
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-400"
          />
        </div>

        {/* الأيقونات والتحكم */}
        <div className="flex items-center gap-4">
          {/* زر Dark / Light Mode */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* زر تغير اللغة */}
          <button
            onClick={toggleLang}
            className="p-2 text-gray-300 hover:text-white transition-colors flex items-center gap-1"
            title="Change Language"
          >
            <Globe className="w-5 h-5" />
            <span className="text-xs font-bold">
              {lang === "ar" ? "EN" : "عربي"}
            </span>
          </button>

          {/* السلة */}
          <Link
            to="/cart"
            className="relative p-2 text-gray-300 hover:text-white transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItemsCount}
              </span>
            )}
          </Link>

          {/* المفضلة */}
          <Link
            to="/wishlist"
            className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors"
          >
            <Heart className="w-5 h-5 text-red-500" />
            <span className="hidden sm:inline">
              {lang === "ar" ? "المفضلة" : "Wishlist"}
            </span>
          </Link>

          {/* طلباتي */}
          <Link
            to="/my-orders"
            className="text-gray-200 hover:text-blue-400 font-medium transition-colors hidden sm:inline"
          >
            {lang === "ar" ? "طلباتي" : "My Orders"}
          </Link>

          {/* المستخدم وتسجيل الدخول / الخروج */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-200">
                {user.name || (lang === "ar" ? "مستخدم" : "User")}
              </span>
              <button
                onClick={logout}
                className="text-sm bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                {lang === "ar" ? "خروج" : "Logout"}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <User className="w-4 h-4" />
              <span>{lang === "ar" ? "دخول" : "Login"}</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}