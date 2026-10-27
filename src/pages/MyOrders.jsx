import React, { useState, useEffect } from "react";
import API from "../services/api";
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  ExternalLink,
  Loader2,
} from "lucide-react";

export default function MyOrders({ lang = "ar" }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get("/orders");
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(
          lang === "ar"
            ? "حدث خطأ أثناء جلب الطلبات السابقة."
            : "Failed to load order history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [lang]);

  const renderStatusBadge = (status) => {
    const statusUpper = String(status ?? "").toUpperCase();
    switch (statusUpper) {
      case "COMPLETED":
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {lang === "ar" ? "تم التسليم" : "Completed"}
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Truck className="w-3.5 h-3.5" />
            {lang === "ar" ? "تم الشحن" : "Shipped"}
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <Package className="w-3.5 h-3.5" />
            {lang === "ar" ? "جاري التحضير" : "Processing"}
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" />
            {lang === "ar" ? "ملغي" : "Cancelled"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            {lang === "ar" ? "قيد الانتظار" : "Pending"}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-400 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
        <Package className="w-8 h-8 text-blue-500" />
        <span>{lang === "ar" ? "طلباتي السابقة" : "My Previous Orders"}</span>
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/60 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {lang === "ar"
              ? "لا توجد لديك طلبات سابقة حتى الآن."
              : "You have no previous orders."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const getFormattedAddress = (addr) => {
              if (!addr)
                return lang === "ar" ? "المنصورة، مصر" : "Mansoura, Egypt";
              if (typeof addr === "object") {
                const formatted = `${addr.street || addr.address || ""}, ${
                  addr.city || ""
                }`
                  .replace(/^,\s*|,\s*$/g, "")
                  .trim();
                return (
                  formatted ||
                  (lang === "ar" ? "المنصورة، مصر" : "Mansoura, Egypt")
                );
              }
              return addr;
            };

            const shippingAddress = getFormattedAddress(
              order.shipToAddress || order.shippingAddress || order.address
            );

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors"
              >
                {/* 1. Order Header */}
                <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-gray-200 dark:border-slate-700/60">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span>
                        {lang === "ar" ? `طلب رقم #${order.id}` : `Order #${order.id}`}
                      </span>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString()
                          : "10/23/2026"}
                      </span>
                    </div>
                  </div>
                  <div>{renderStatusBadge(order.status)}</div>
                </div>

                {/* 2. Location / Shipping Address Section */}
                <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-3.5 my-4 flex flex-wrap items-center justify-between text-sm border border-gray-200 dark:border-slate-800 gap-3">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">
                        {lang === "ar" ? "عنوان التوصيل:" : "Delivery Address:"}
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {shippingAddress}
                      </span>
                    </div>
                  </div>

                  {/* Location Map Button */}
                  <a
                    href={
                      order.shipToAddress?.street?.startsWith("http")
                        ? order.shipToAddress.street
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            shippingAddress
                          )}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors border border-blue-200 dark:border-blue-500/20"
                  >
                    <span>{lang === "ar" ? "اللويكيشن" : "Location"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* 3. Items List */}
                <div className="space-y-3 pt-2">
                  {(order.items || order.orderItems || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm py-1 border-b border-gray-100 dark:border-slate-700/30 last:border-0"
                    >
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {item.productName ||
                            item.name ||
                            item.itemOrdered?.productName ||
                            (lang === "ar" ? "منتج" : "Product")}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {lang === "ar" ? "الكمية: " : "Qty: "}
                          {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        {(
                          (item.unitPrice || item.price || 0) * item.quantity
                        ).toFixed(2)}{" "}
                        EGP
                      </span>
                    </div>
                  ))}
                </div>

                {/* 4. Total Amount Footer */}
                <div className="pt-4 mt-3 border-t border-gray-200 dark:border-slate-700/60 flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {lang === "ar" ? "الإجمالي الكلي:" : "Total Amount:"}
                  </span>
                  <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                    {(
                      order.totalPrice ||
                      order.totalAmount ||
                      order.subtotal ||
                      0
                    ).toFixed(2)}{" "}
                    EGP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}