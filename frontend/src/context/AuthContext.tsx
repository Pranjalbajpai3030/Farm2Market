import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "farmer" | "buyer";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const API_HOST = import.meta.env.VITE_API_HOST;
console.log(API_HOST);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize user on mount
    const token = localStorage.getItem("jwtToken");
    if (token) {
      fetchUserFromToken(token);
    }
  }, []);

  const fetchUserFromToken = async (token: string) => {
    try {
      // Decode token or fetch user info (add your endpoint here if required)
      const response = await fetch("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch user");
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      console.error(err);
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(
        `https://farm2market-pearl.vercel.app/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      console.log(data.message); // Display message to the user
      localStorage.setItem("jwtToken", data.jwtToken); // Save token
      await fetchUserFromToken(data.jwtToken); // Fetch user info
      navigate("/");
    } catch (err) {
      console.error(err);
      throw new Error("Login failed");
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch(
        `https://farm2market-pearl.vercel.app/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password }),
        }
      );
      if (!response.ok) throw new Error("Signup failed");
      const data = await response.json();
      console.log(data.message); // Display message to the user
      localStorage.setItem("userId", data.userId); // Save user ID for OTP verification
      navigate("/verify-otp");
    } catch (err) {
      console.error(err);
      throw new Error("Signup failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context) {
    context.isAuthenticated = true;
  }
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
