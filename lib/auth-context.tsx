"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError, clearTokens, getAccessToken, getRefreshToken, setTokens } from "./api-client";

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

export type Role = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER" | "SUPER_ADMIN";

interface MeResponse {
  user: WorkspaceUser;
  workspace: Workspace | null;
  role: Role;
  isSuperAdmin: boolean;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  businessName: string;
  niche?: string;
  phone?: string;
}

interface AuthContextValue {
  user: WorkspaceUser | null;
  workspace: Workspace | null;
  role: Role | null;
  isSuperAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ isSuperAdmin: boolean }>;
  loginWithTokens: (accessToken: string, refreshToken: string) => Promise<{ isSuperAdmin: boolean }>;
  register: (input: RegisterInput) => Promise<{ message: string }>;
  logout: () => Promise<void>;
  refetchMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<WorkspaceUser | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadMe = useCallback(async (): Promise<MeResponse | null> => {
    try {
      const data = await api.get<MeResponse>("/auth/me");
      setUser(data.user);
      setWorkspace(data.workspace);
      setRole(data.role);
      setIsSuperAdmin(data.isSuperAdmin);
      return data;
    } catch {
      setUser(null);
      setWorkspace(null);
      setRole(null);
      setIsSuperAdmin(false);
      return null;
    }
  }, []);

  const fetchMe = useCallback(async () => {
    await loadMe();
  }, [loadMe]);

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
      const me = await loadMe();
      return { isSuperAdmin: me?.isSuperAdmin ?? false };
    },
    [loadMe]
  );

  // Used by /auth/callback after "Continue with Google" — the backend has
  // already authenticated the person and handed back a token pair via redirect.
  const loginWithTokens = useCallback(
    async (accessToken: string, refreshToken: string) => {
      setTokens(accessToken, refreshToken);
      const me = await loadMe();
      return { isSuperAdmin: me?.isSuperAdmin ?? false };
    },
    [loadMe]
  );

  // No tokens are issued at signup anymore — every new account starts
  // PENDING until a super_admin approves it. This just creates the account
  // and returns the "under review" message for the pending screen to show.
  const register = useCallback(async (input: RegisterInput) => {
    const data = await api.post<{ status: "pending"; message: string; accountId: string }>(
      "/auth/register",
      input,
      { skipAuth: true }
    );
    return { message: data.message };
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) await api.post("/auth/logout", { refreshToken }, { skipAuth: true });
    } catch {
      // best-effort — clear local state regardless
    }
    clearTokens();
    setUser(null);
    setWorkspace(null);
    setRole(null);
    setIsSuperAdmin(false);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, workspace, role, isSuperAdmin, loading, login, loginWithTokens, register, logout, refetchMe: fetchMe }}
    >
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
