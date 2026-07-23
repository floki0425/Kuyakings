import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Order from "./pages/Order";
import ThankYou from "./pages/ThankYou";
import AdminLogin from "./pages/AdminLogin";
import OrderDetails from "./pages/OrderDetails";
import AdminDashboard from "./components/admin/AdminDashboard";
import TrackOrder from "./pages/TrackOrder";
import SetupPassword from "./pages/SetupPassword";
import Legal from "./pages/Legal";
import BrandAssets from "./pages/BrandAssets";
import SalesReport from "./pages/SalesReport";
import PaymentSettings from "./pages/PaymentSettings";
import ContactMessages from "./pages/ContactMessages";
import About from "./pages/About";
import Menu from "./pages/Menu";
import Contact from "./pages/Contact";
import Process from "./pages/Process";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/layout/ScrollToTop";
import Analytics from "./components/layout/Analytics";
import MessengerButton from "./components/layout/MessengerButton";





function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Analytics />
      <MessengerButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/process" element={<Process />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/setup-password" element={<SetupPassword />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/sales" element={<SalesReport />} />
        <Route path="/admin/brand-assets" element={<BrandAssets />} />
        <Route path="/admin/payment-settings" element={<PaymentSettings />} />
        <Route path="/admin/contact-messages" element={<ContactMessages />} />
        <Route path="/admin/orders/:id" element={<OrderDetails />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
