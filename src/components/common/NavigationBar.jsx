import { NavLink } from 'react-router-dom';
import useAuth from "../../firebaseServices/auth/useAuth";
import styles from './Navigation.module.css';
import logo from '../../assets/logo.png';

function NavigationBar() {
  const { user } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Voltizen Logo" className={styles.logo} />
        
        <h1 className={styles.title}>Voltizen</h1>
      </div>
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
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to="/connections">Connections</NavLink>
            </li>
          </>
        )}

      </ul>
    </nav>
  )
}

export default NavigationBar;