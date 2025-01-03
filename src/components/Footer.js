import React from "react";
import "./Footer.css"; // Footer özel stilleri

const Footer = () => {
  return (
    <footer className="footer">
      <div className="social-links">
        <a
          href="https://www.youtube.com/@Teksanbil"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/icons/youtube-icon.svg" alt="YouTube" />
        </a>
        <a
          href="https://www.instagram.com/teksanbil"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/icons/instagram-icon.svg" alt="Instagram" />
        </a>
        <a
          href="https://twitter.com/teksanbil"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/icons/twitter-icon.svg" alt="Twitter" />
        </a>
      </div>
      <p>© 2025 Teksanbil. Tüm Hakları Saklıdır.</p>
    </footer>
  );
};

export default Footer;
