import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import TopBanner from "./components/TopBanner";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Index from "./pages/Index";

const Coleccion = lazy(() => import("./pages/Coleccion"));
const ProductoDetalle = lazy(() => import("./pages/ProductoDetalle"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutResult = lazy(() => import("./pages/CheckoutResult"));
const Login = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ProductoForm = lazy(() => import("./pages/admin/ProductoForm"));
const AdminGuard = lazy(() => import("./components/admin/AdminGuard"));

function Loader() {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBanner />
      <Header />
      <CartDrawer />
      <main className="flex-1">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/coleccion" element={<Coleccion />} />
            <Route path="/producto/:id" element={<ProductoDetalle />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/resultado" element={<CheckoutResult />} />
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin/dashboard"
              element={
                <Suspense fallback={<Loader />}>
                  <AdminGuard>
                    <Dashboard />
                  </AdminGuard>
                </Suspense>
              }
            />
            <Route
              path="/admin/producto/nuevo"
              element={
                <Suspense fallback={<Loader />}>
                  <AdminGuard>
                    <ProductoForm />
                  </AdminGuard>
                </Suspense>
              }
            />
            <Route
              path="/admin/producto/:id"
              element={
                <Suspense fallback={<Loader />}>
                  <AdminGuard>
                    <ProductoForm />
                  </AdminGuard>
                </Suspense>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
