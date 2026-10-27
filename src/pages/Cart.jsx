import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function Cart({ lang = "ar" }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalAmount } =
    useContext(CartContext);

  // ترجمة النصوص بحسب اللغة
  const t = {
    title: lang === "ar" ? "سلة التسوق" : "Shopping Cart",
    emptyCart:
      lang === "ar"
        ? "سلة التسوق فارغة حالياً"
        : "Your cart is currently empty",
    shopNow: lang === "ar" ? "تصفح المنتجات 🛍️" : "Browse Products 🛍️",
    quantity: lang === "ar" ? "الكمية:" : "Qty:",
    clearCart: lang === "ar" ? "إفراغ السلة بالكامل" : "Clear Entire Cart",
    summaryTitle: lang === "ar" ? "ملخص الطلب" : "Order Summary",
    subtotal: lang === "ar" ? "المجموع الفرعي" : "Subtotal",
    shipping: lang === "ar" ? "الشحن" : "Shipping",
    free: lang === "ar" ? "مجاني" : "Free",
    total: lang === "ar" ? "الإجمالي الكلي" : "Total Amount",
    checkout: lang === "ar" ? "إتمام الطلب (Checkout)" : "Proceed to Checkout",
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-10 max-w-lg mx-auto shadow-md">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            {t.emptyCart}
          </h2>
          <Link
            to="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {t.shopNow}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        {t.title}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* قائمة منتجات السلة */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 transition-colors"
            >
              {/* تفاصيل وصورة المنتج */}
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl || item.pictureUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl border border-gray-100 dark:border-gray-700"
                />
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                    {item.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-extrabold text-md mb-2">
                    ${item.price}
                  </p>

                  {/* أزرار زيادة ونقصان الكمية */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">{t.quantity}</span>
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-2.5 py-1 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 font-bold text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2.5 py-1 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* زر الحذف */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          {/* زر إفراغ السلة */}
          <div className="pt-2">
            <button
              onClick={clearCart}
              className="text-red-600 dark:text-red-400 hover:underline text-sm font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              {t.clearCart}
            </button>
          </div>
        </div>

        {/* كارت ملخص الطلب */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm sticky top-24 transition-colors">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
              {t.summaryTitle}
            </h2>

            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {totalAmount ? totalAmount.toFixed(2) : "0.00"} EGP
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t.shipping}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {t.free}
                </span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between text-base font-extrabold text-gray-900 dark:text-white">
                <span>{t.total}</span>
                <span className="text-blue-600 dark:text-blue-400 text-xl">
                  {totalAmount ? totalAmount.toFixed(2) : "0.00"} EGP
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-6 w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md"
            >
              {t.checkout}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
