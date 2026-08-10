import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import { useAuth } from "./context/useAuth";
import Dashboard from "./pages/Dashboard/Dashboard";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Notes from "./pages/Notes/Notes";
import Placeholder from "./pages/Placeholder/Placeholder";
import Register from "./pages/Register/Register";

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

        <Route path="/notes" element={<Notes />} />

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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;