import { createContext } from "react";

import type { User } from "../lib/api";

export type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: {
    email: string;
    password: string;
  }) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);