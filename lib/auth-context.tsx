"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError, clearTokens, getAccessToken, setTokens } from "./api-client";

export interface WorkspaceUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  createdAt?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  timezone?: string;
  industry?: string | null;
}

export type Role = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

interface MeResponse {
  user: WorkspaceUser;
  workspace: Workspace;
  role: Role;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextValue {
  user: WorkspaceUser | null;
  workspace: Workspace | null;
  role: Role | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { name: string; email: string; password: string; workspaceName: string }) => Promise<void>;
  logout: () => Promise<void>;
  refetchMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<WorkspaceUser | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchMe = useCallback(async () => {
    try {
      const data = await api.get<MeResponse>("/auth/me");
      setUser(data.user);
      setWorkspace(data.workspace);
      setRole(data.role);
    } catch {
      setUser(null);
      setWorkspace(null);
      setRole(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (getAccessToken()) {
        await fetchMe();
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await api.post<{ user: WorkspaceUser } & AuthTokens>(
        "/auth/login",
        { email, password },
        { skipAuth: true }
      );
      setTokens(data.accessToken, data.refreshToken);
      await fetchMe();
    },
    [fetchMe]
  );

  const register = useCallback(
    async (input: { name: string; email: string; password: string; workspaceName: string }) => {
      const data = await api.post<{ user: WorkspaceUser } & AuthTokens>("/auth/register", input, { skipAuth: true });
      setTokens(data.accessToken, data.refreshToken);
      await fetchMe();
    },
    [fetchMe]
  );

  const logout = useCallback(async () => {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("orbit_refresh_token") : null;
    try {
      if (refreshToken) await api.post("/auth/logout", { refreshToken }, { skipAuth: true });
    } catch {
      // best-effort — clear local state regardless
    }
    clearTokens();
    setUser(null);
    setWorkspace(null);
    setRole(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, workspace, role, loading, login, register, logout, refetchMe: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export { ApiError };
