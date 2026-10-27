import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await fetch("https://e-stoore.runasp.net/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data); // للتحقق من شكل البيانات في الـ Console

      // دعم مختلف أشكال الـ Token القادمة من السيرفر (token أو Token أو accessToken)
      const authToken = data.token || data.Token || data.accessToken;

      if (response.ok && authToken) {
        localStorage.setItem("token", authToken);
        setToken(authToken);

        const userData = data.user || {
          email: email,
          name: data.username || data.fullName || email.split("@")[0],
        };

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || "بيانات الدخول غير صحيحة",
        };
      }
    } catch (err) {
      console.error("Login Error:", err);
      return { success: false, message: "تعذر الاتصال بالسيرفر" };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch("https://e-stoore.runasp.net/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ FullName: name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || "فشل إنشاء الحساب",
        };
      }
    } catch (err) {
      return { success: false, message: "تعذر الاتصال بالسيرفر" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoggedIn: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};
