import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // Header için özel stiller

function Header() {
  return (
    <header className="header">
      <div className="logo-container">
        <h1>TEKSANBİL</h1>
        <p className="tagline">Teknoloji | Sanat | Bilim</p> {/* Kısaltma gibi görünsün diye */}
      </div>
      <div className="line"></div> {/* Beyaz çizgi */}
      <nav>
        <ul className="nav-list">
          <li><Link to="/">Ana Sayfa</Link></li>
          <li><Link to="/about">Hakkında</Link></li>
          <li><Link to="/stories">Hikayeler</Link></li>
          <li><Link to="/contact">İletişim</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
