"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  username: string | null;
  login: (name: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mongo_demo_username");
    if (saved) {
      setUsername(saved);
    }
    setMounted(true);
  }, []);

  const login = (name: string) => {
    localStorage.setItem("mongo_demo_username", name);
    setUsername(name);
  };

  const logout = () => {
    localStorage.removeItem("mongo_demo_username");
    setUsername(null);
  };

  // 避免服务端渲染不匹配
  // if (!mounted) return <>{children}</>;

  return (
    <UserContext.Provider value={{ username, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
