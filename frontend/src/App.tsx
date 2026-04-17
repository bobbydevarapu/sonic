import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-slate-950 text-white">Loading SonicFlux...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function LandingRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-slate-950 text-white">Loading SonicFlux...</div>;
  }

  if (user) {
    return <Navigate to="/app" replace />;
  }

  return <LandingPage />;
}

function DefaultRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-slate-950 text-white">Loading SonicFlux...</div>;
  }

  return <Navigate to={user ? '/app' : '/'} replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<div className="grid min-h-screen place-items-center bg-slate-950 text-white">Loading SonicFlux...</div>}>
          <Routes>
            <Route path="/" element={<LandingRoute />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<DefaultRoute />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}