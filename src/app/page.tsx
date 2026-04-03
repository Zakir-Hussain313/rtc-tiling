import Navbar from "@/Components/Navbar";
import Home from "@/pages/Landing/Home";

export default function Page() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="page-content">
        <Home />
      </main>
    </div>
  );
}