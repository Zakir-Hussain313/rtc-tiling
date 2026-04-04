import Home from "../pages/Landing/Home";
import Navbar from "../Components/Navbar";
import Footer from "@/Components/Footer";

export default function Page() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="page-content">
        <Home />
      </main>
      <Footer />
    </div>
  );
}