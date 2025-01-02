import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Stories from "./pages/Stories";
import Contact from "./pages/Contact";

function App() {
  return (
    <Router>
      <div className="app">
        {/* Header her sayfada gösterilir */}
        <Header />
        <main>
          {/* Sayfa geçişlerini buradan kontrol ediyoruz */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        {/* Footer her sayfada gösterilir */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
