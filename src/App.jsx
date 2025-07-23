import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { Loader2 } from 'lucide-react';
import { ROLES } from './contexts/AuthContext';

// Lazy load components
const MainLayout = lazy(() => import('./components/layout/MainLayout'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const OrdensServicoPage = lazy(() => import('./pages/OrdensServicoPage'));
const ClientesPage = lazy(() => import('./pages/ClientesPage'));
const CrmPage = lazy(() => import('./pages/CrmPage'));
const RelatoriosPage = lazy(() => import('./pages/RelatoriosPage'));
const EquipePage = lazy(() => import('./pages/EquipePage'));
const GerenciarEncerramentosPage = lazy(() => import('./pages/GerenciarEncerramentosPage'));
const AvisarClientePage = lazy(() => import('./pages/AvisarClientePage'));
const NovaOrdemServicoPage = lazy(() => import('./pages/NovaOrdemServicoPage'));
const DetalhesOrdemServicoPage = lazy(() => import('./pages/DetalhesOrdemServicoPage'));
const EncerramentoPage = lazy(() => import('./pages/EncerramentoPage'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Role-based access control component
const RequireRole = ({ children, allowedRoles, userRole }) => {
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/ordens-servico" replace />;
  }
  return children;
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              <Route path="/*" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/dashboard" element={
                        <RequireRole allowedRoles={[ROLES.GERENCIA]} userRole={JSON.parse(localStorage.getItem('user') || '{}').cargo}>
                          <DashboardPage />
                        </RequireRole>
                      } />
                      
                      <Route path="/ordens-servico" element={<OrdensServicoPage />} />
                      <Route path="/ordens-servico/:id" element={<DetalhesOrdemServicoPage />} />
                      
                      <Route path="/ordem-de-servico/nova" element={
                        <RequireRole allowedRoles={[ROLES.GERENCIA, ROLES.VENDEDOR]} userRole={JSON.parse(localStorage.getItem('user') || '{}').cargo}>
                          <NovaOrdemServicoPage />
                        </RequireRole>
                      } />
                      
                      <Route path="/clientes" element={
                        <RequireRole allowedRoles={[ROLES.GERENCIA, ROLES.VENDEDOR]} userRole={JSON.parse(localStorage.getItem('user') || '{}').cargo}>
                          <ClientesPage />
                        </RequireRole>
                      } />
                      
                      <Route path="/crm" element={
                        <RequireRole allowedRoles={[ROLES.GERENCIA, ROLES.VENDEDOR]} userRole={JSON.parse(localStorage.getItem('user') || '{}').cargo}>
                          <CrmPage />
                        </RequireRole>
                      } />
                      
                      <Route path="/relatorios" element={
                        <RequireRole allowedRoles={[ROLES.GERENCIA]} userRole={JSON.parse(localStorage.getItem('user') || '{}').cargo}>
                          <RelatoriosPage />
                        </RequireRole>
                      } />
                      
                      <Route path="/equipe" element={
                        <RequireRole allowedRoles={[ROLES.GERENCIA]} userRole={JSON.parse(localStorage.getItem('user') || '{}').cargo}>
                          <EquipePage />
                        </RequireRole>
                      } />
                      
                      <Route path="/gerenciar-encerramentos" element={
                        <RequireRole allowedRoles={[ROLES.GERENCIA]} userRole={JSON.parse(localStorage.getItem('user') || '{}').cargo}>
                          <GerenciarEncerramentosPage />
                        </RequireRole>
                      } />
                      
                      <Route path="/avisar-cliente" element={
                        <RequireRole allowedRoles={[ROLES.GERENCIA, ROLES.VENDEDOR]} userRole={JSON.parse(localStorage.getItem('user') || '{}').cargo}>
                          <AvisarClientePage />
                        </RequireRole>
                      } />
                      
                      <Route path="/encerramento" element={
                        <RequireRole allowedRoles={[ROLES.GERENCIA]} userRole={JSON.parse(localStorage.getItem('user') || '{}').cargo}>
                          <EncerramentoPage />
                        </RequireRole>
                      } />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;