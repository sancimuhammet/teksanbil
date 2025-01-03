import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Stories from "./pages/Stories";
import Contact from "./pages/Contact";
import './App.css'; // Genel stilleri yükleme

function App() {
  return (
    <Router>
      <div className="app">
        {/* Sayfanın üst kısmında Header bileşeni */}
        <Header />
        <main className="main-content">
          {/* Uygulamanın farklı sayfalarına yönlendirme */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        {/* Sayfanın alt kısmında Footer bileşeni */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
