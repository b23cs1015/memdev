import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import { useAuth } from "./context/useAuth";

import Dashboard from "./pages/Dashboard/Dashboard";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Notes from "./pages/Notes/Notes";
import NoteDetails from "./pages/Notes/NoteDetails";
import Placeholder from "./pages/Placeholder/Placeholder";
import Collections from "./pages/Collections/Collections";
import CollectionDetails from "./pages/Collections/CollectionDetails";

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF8]">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        Loading MemDev...
      </div>
    </main>
  );
}

function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicOnlyRoute({
  children,
}: {
  children: ReactNode;
}) {
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
      <Route
        path="/"
        element={<Landing />}
      />

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
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/notes"
          element={<Notes />}
        />

        <Route
          path="/notes/:id"
          element={<NoteDetails />}
        />

        <Route
          path="/collections"
          element={<Collections />}
        />

        <Route
          path="/collections/:id"
          element={<CollectionDetails />}
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

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;