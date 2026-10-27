import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import API from "../services/api";
import { MapPin, Navigation, Loader2 } from "lucide-react";

export default function Checkout({ lang = "ar" }) {
  const { cartItems, totalAmount, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  // النصوص باللغتين
  const t = {
    title: lang === "ar" ? "إتمام الطلب" : "Checkout",
    firstName: lang === "ar" ? "الاسم الأول" : "First Name",
    lastName: lang === "ar" ? "اسم العائلة" : "Last Name",
    address: lang === "ar" ? "العنوان (الشارع / المبنى)" : "Street Address",
    city: lang === "ar" ? "المدينة" : "City",
    state: lang === "ar" ? "المنطقة / المحافظة" : "State",
    zipCode: lang === "ar" ? "الرمز البريدي" : "Zip Code",
    phone: lang === "ar" ? "رقم الهاتف" : "Phone Number",
    total: lang === "ar" ? "الإجمالي الكلي:" : "Total Amount:",
    submit: lang === "ar" ? "تأكيد الطلب" : "Place Order",
    submitting: lang === "ar" ? "...جاري التأكيد" : "Processing...",
    useGps: lang === "ar" ? "استخدام موقعي الحالي (GPS)" : "Use GPS Location",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // دالة جلب الموقع الحالي عبر الـ GPS
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert(
        lang === "ar"
          ? "خاصية تحديد الموقع غير مدعومة في متصفحك."
          : "Geolocation is not supported by your browser."
      );
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
        setFormData((prev) => ({
          ...prev,
          address: mapUrl,
        }));
        setGettingLocation(false);
      },
      (error) => {
        console.error("Location error:", error);
        alert(
          lang === "ar"
            ? "تعذر تحديد موقعك الحالي تلقائيًا."
            : "Failed to retrieve location."
        );
        setGettingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // تجهيز هيكل البيانات ليتطابق مع C# OrderCreatedDto تماماً
      const orderData = {
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        phoneNumber: formData.phoneNumber,
        items: cartItems.map((item) => ({
          id: item.id || item.productId,
          productName: item.name || item.productName || "Product",
          pictureUrl: item.image || item.pictureUrl || "",
          price: item.price || item.unitPrice || 0,
          quantity: item.quantity,
        })),
      };

      await API.post("/orders", orderData);
      clearCart();
      navigate("/my-orders");
    } catch (err) {
      console.error("Error creating order:", err.response?.data || err);
      const serverMsg = err.response?.data || "Failed to place order.";
      alert(typeof serverMsg === "string" ? serverMsg : "فشل إرسال الطلب، تحقق من البيانات.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        {t.title}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl shadow-xl space-y-6"
      >
        {/* الاسم الأول والأخير */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t.firstName}
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t.lastName}
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* العنوان الرئيسي وزر GPS */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t.address}
            </label>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={gettingLocation}
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg transition-colors"
            >
              {gettingLocation ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5" />
              )}
              <span>{t.useGps}</span>
            </button>
          </div>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder={
              lang === "ar"
                ? "اكتب عنوانك بالتفصيل أو اضغط زر GPS"
                : "Enter full street address or click GPS"
            }
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        {/* المدينة والمنطقة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t.city}
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t.state}
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* الرمز البريدي ورقم الهاتف */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t.zipCode}
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t.phone}
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* زر التأكيد والمجموع */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
          <div>
            <span className="text-gray-500 dark:text-gray-400 text-sm block">
              {t.total}
            </span>
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {totalAmount ? totalAmount.toFixed(2) : "0.00"} EGP
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || cartItems.length === 0}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-colors disabled:opacity-50"
          >
            {loading ? t.submitting : t.submit}
          </button>
        </div>
      </form>
    </div>
  );
}