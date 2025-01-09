import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo-container">
        <h1>TEKSANBİL</h1>
        <p className="tagline">Teknoloji | Sanat | Bilim</p>
      </div>
      <button className="menu-button" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <button className="close-button" onClick={toggleMenu}>
          ×
        </button>
        <nav>
          <ul className="nav-list">
            <li>
              <Link to="/" onClick={toggleMenu}>Ana Sayfa</Link>
            </li>
            <li>
              <Link to="/about" onClick={toggleMenu}>Hakkında</Link>
            </li>
            <li>
              <Link to="/stories" onClick={toggleMenu}>Hikayeler</Link>
            </li>
            <li>
              <Link to="/contact" onClick={toggleMenu}>İletişim</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
