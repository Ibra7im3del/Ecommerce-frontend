import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Footer from "./components/Footer";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ar");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleLang = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, lang]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Router>
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          lang={lang}
          toggleLang={toggleLang}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home lang={lang} />} />
            <Route
              path="/products"
              element={<Products searchTerm={searchTerm} lang={lang} />}
            />
            <Route
              path="/products/:id"
              element={<ProductDetails lang={lang} />}
            />
            <Route path="/cart" element={<Cart lang={lang} />} />
            <Route path="/checkout" element={<Checkout lang={lang} />} />
            <Route path="/my-orders" element={<MyOrders lang={lang} />} />
            <Route path="/wishlist" element={<Wishlist lang={lang} />} />
            <Route path="/login" element={<Login lang={lang} />} />
            <Route path="/register" element={<Register lang={lang} />} />
          </Routes>
        </main>
        <Footer lang={lang} />
      </Router>
    </div>
  );
}
