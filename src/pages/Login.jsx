import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login({ lang = "ar" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // ترجمة النصوص بحسب اللغة - بنفس أسلوب Cart.jsx بالضبط
  const t = {
    title: lang === "ar" ? "تسجيل الدخول" : "Sign In",
    subtitle:
      lang === "ar"
        ? "أدخل بيانات حسابك للوصول إلى المتجر"
        : "Enter your account credentials to continue",
    emailLabel: lang === "ar" ? "البريد الإلكتروني" : "Email Address",
    emailPlaceholder: "name@example.com",
    passwordLabel: lang === "ar" ? "كلمة المرور" : "Password",
    submitBtn: lang === "ar" ? "دخول" : "Sign In",
    submittingBtn: lang === "ar" ? "...جاري الدخول" : "Signing in...",
    noAccount: lang === "ar" ? "ليس لديك حساب؟" : "Don't have an account?",
    registerLink: lang === "ar" ? "إنشاء حساب جديد" : "Create Account",
    errorMessage:
      lang === "ar"
        ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
        : "Invalid email or password",
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login(email, password);

      if (res && res.success) {
        // التحويل فقط لو تسجيل الدخول نجح والتوكين اتحفظ
        navigate("/");
      } else {
        // لو السيرفر رفض البيانات (كلمة مرور خطأ مثلاً)
        setError(res?.message || t.errorMessage);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(t.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-[82vh] flex items-center justify-center px-4 py-12 transition-colors duration-300"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-800/90 border border-gray-100 dark:border-slate-700/70 rounded-3xl shadow-2xl dark:shadow-slate-900/50 backdrop-blur-md p-8 sm:p-10 transition-all duration-300 relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header Section */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4 shadow-inner ring-1 ring-blue-500/20">
            <LogIn className={`w-8 h-8 ${lang === "ar" ? "rotate-180" : ""}`} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {t.subtitle}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 text-sm bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t.emailLabel}
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400 dark:text-gray-500">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t.emailPlaceholder}
                className="w-full ps-11 pe-4 py-3 bg-gray-50 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t.passwordLabel}
              </label>
            </div>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400 dark:text-gray-500">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full ps-11 pe-12 py-3 bg-gray-50 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 end-0 flex items-center pe-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                title={showPassword ? (lang === "ar" ? "إخفاء" : "Hide") : (lang === "ar" ? "إظهار" : "Show")}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t.submittingBtn}</span>
              </>
            ) : (
              <span>{t.submitBtn}</span>
            )}
          </button>
        </form>

        {/* Register Link Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700/80 text-center text-sm text-gray-500 dark:text-gray-400 relative z-10">
          <span>{t.noAccount}</span>{" "}
          <Link
            to="/register"
            className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline transition-colors ms-1 inline-block"
          >
            {t.registerLink}
          </Link>
        </div>

      </div>
    </div>
  );
}