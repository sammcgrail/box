import { Routes, Route } from "react-router-dom";
import { Footer } from "@/components/footer";
import { Home } from "@/pages/home";
import { NotFound } from "@/pages/not-found";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
