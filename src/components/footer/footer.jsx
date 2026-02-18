// ...existing code...
import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>CarRental</h3>
          <p>Premium cars. Easy booking. Trusted service.</p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <h4>Company</h4>
          <Link to="/">Home</Link>
          <Link to="/vehicles">Vehicles</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="footer-contact">
          <h4>Contact</h4>
          <a href="mailto:support@carrental.example">support@carrental.example</a>
          <a href="tel:+15551234567">+1 (555) 123-4567</a>
        </div>

        <div className="footer-social">
          <h4>Follow us</h4>
          <div className="social-row">
            <a href="#" aria-label="Twitter" className="social-link" title="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 5.92c-.66.29-1.37.49-2.12.58.76-.45 1.35-1.16 1.63-2.02-.71.42-1.5.73-2.34.9A3.64 3.64 0 0016.15 4c-2 0-3.62 1.76-3.17 3.67-2.66-.13-5.02-1.42-6.6-3.37-.87 1.5-.37 3.46 1.07 4.44-.53-.02-1.04-.16-1.48-.4v.04c0 1.8 1.26 3.3 2.95 3.64-.47.13-.97.15-1.48.06.42 1.36 1.65 2.34 3.1 2.37A7.35 7.35 0 013 19.55 10.35 10.35 0 008.9 21c6.68 0 10.33-5.58 10.33-10.42v-.47c.7-.5 1.3-1.12 1.78-1.83-.64.28-1.32.48-2.02.57z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="social-link" title="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.1A3.9 3.9 0 1015.9 12 3.9 3.9 0 0012 8.1zM18.5 6.2a1.1 1.1 0 11-1.1-1.1 1.1 1.1 0 011.1 1.1z"/></svg>
            </a>
            <a href="#" aria-label="Facebook" className="social-link" title="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2v-2.9h2.2V9.3c0-2.2 1.3-3.4 3.3-3.4.95 0 1.95.17 1.95.17v2.1h-1.08c-1.07 0-1.4.66-1.4 1.34v1.6h2.38l-.38 2.9h-2v7A10 10 0 0022 12z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <small>© {new Date().getFullYear()} CarRental — All rights reserved.</small>
        <div className="policy-links">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}