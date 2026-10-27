import React from "react";
import { Link } from "react-router-dom";

export default function Footer({ lang = "ar" }) {
  return (
    <footer className="bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-gray-300 py-12 border-t border-gray-200 dark:border-slate-800 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* نبذة عن المتجر */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            E-Store
          </h3>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {lang === "ar"
              ? "متجرك الإلكتروني المفضل لأفضل المنتجات بأفضل الأسعار وبجودة عالية وشحن سريع."
              : "Your favorite online store for the best products at great prices with fast shipping."}
          </p>
        </div>

        {/* روابط سريعة */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {lang === "ar" ? "روابط سريعة" : "Quick Links"}
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {lang === "ar" ? "الرئيسية" : "Home"}
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {lang === "ar" ? "المنتجات" : "Products"}
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {lang === "ar" ? "السلة" : "Cart"}
              </Link>
            </li>
          </ul>
        </div>

        {/* تواصل معنا */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {lang === "ar" ? "تواصل معنا" : "Contact Us"}
          </h4>
          <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
            {lang === "ar"
              ? "البريد الإلكتروني: support@estore.com"
              : "Email: support@estore.com"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {lang === "ar"
              ? "الهاتف: +20 123 456 7890"
              : "Phone: +20 123 456 7890"}
          </p>
        </div>
      </div>

      {/* حقوق الملكية */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-200 dark:border-slate-800 text-center text-xs text-gray-500 dark:text-gray-400">
        {lang === "ar"
          ? "© 2026 E-Store. جميع الحقوق محفوظة."
          : "© 2026 E-Store. All rights reserved."}
      </div>
    </footer>
  );
}
