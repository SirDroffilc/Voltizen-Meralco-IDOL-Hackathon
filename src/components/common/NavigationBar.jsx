import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import useAuth from "../../firebaseServices/auth/useAuth";
import styles from './Navigation.module.css';

function NavigationBar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const logo = "https://res.cloudinary.com/ddr9shttr/image/upload/v1765377260/voltizen-logo_syh9c8.png";
  
  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Voltizen Logo" className={styles.logo} />
      </div>

      {/* Desktop links */}
      <ul className={styles.navlinks}>
        {user && (
          <>
            <li className={styles.navItem}>
              <NavLink to="/">Map</NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to="/inventory">Inventory</NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to="/connections">Connections</NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to="/profile">Profile</NavLink>
            </li>
          </>
        )}
      </ul>

      {/* Hamburger for mobile/tablet */}
      <button
        className={styles.hamburger}
        aria-label="Open navigation menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((s) => !s)}
      >
        <span className={styles.hamburgerBox}>
          <span className={styles.hamburgerInner} />
        </span>
      </button>

      {/* Overlay menu (right-top) */}
      <div className={`${styles.overlay} ${menuOpen ? styles.open : ""}`} onClick={() => setMenuOpen(false)}>
        <div className={styles.overlayContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeBtn} onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button>
          <ul className={styles.overlayLinks}>
            {user && (
              <>
                <li onClick={() => setMenuOpen(false)}><NavLink to="/">Map</NavLink></li>
                <li onClick={() => setMenuOpen(false)}><NavLink to="/inventory">Inventory</NavLink></li>
                <li onClick={() => setMenuOpen(false)}><NavLink to="/profile">Profile</NavLink></li>
                <li onClick={() => setMenuOpen(false)}><NavLink to="/connections">Connections</NavLink></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavigationBar;