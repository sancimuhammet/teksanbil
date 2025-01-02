import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <h1>Teksanbil</h1>
      <nav>
        <ul>
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
