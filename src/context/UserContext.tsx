"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  username: string | null;
  userId: string | null;
  login: (name: string, id: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("mongo_demo_username");
    const savedId = localStorage.getItem("mongo_demo_userid");
    if (savedName) {
      setUsername(savedName);
    }
    if (savedId) {
      setUserId(savedId);
    }
    setMounted(true);
  }, []);

  const login = (name: string, id: string) => {
    localStorage.setItem("mongo_demo_username", name);
    localStorage.setItem("mongo_demo_userid", id);
    setUsername(name);
    setUserId(id);
  };

  const logout = () => {
    localStorage.removeItem("mongo_demo_username");
    localStorage.removeItem("mongo_demo_userid");
    setUsername(null);
    setUserId(null);
  };

  // 避免服务端渲染不匹配
  // if (!mounted) return <>{children}</>;

  return (
    <UserContext.Provider value={{ username, userId, login, logout }}>
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
