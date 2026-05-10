import { useEffect, useState } from "react";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const { user, isAuthenticated, setUser, setAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", { method: "GET" });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setAuthenticated]);

  const logout = () => {
    fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setAuthenticated(false);
    router.push("/auth/login");
  };

  const requireAuth = () => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    logout,
    requireAuth,
  };
};
