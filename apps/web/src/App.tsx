import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./context/useAuth";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Placeholder from "./pages/Placeholder/Placeholder";

import type { ReactNode } from "react";

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF8] text-[#171717]">
      <p className="text-sm text-slate-500">Loading MemDev...</p>
    </main>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  <Route
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/notes"
        element={
          <Placeholder
            title="Notes"
            description="Browse and manage your saved notes."
          />
        }
      />

      <Route
        path="/collections"
        element={
          <Placeholder
            title="Collections"
            description="Organize your knowledge into collections."
          />
        }
      />

      <Route
        path="/tags"
        element={
          <Placeholder
            title="Tags"
            description="Manage tags across your knowledge library."
          />
        }
      />
    </Route>

  return children;
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;