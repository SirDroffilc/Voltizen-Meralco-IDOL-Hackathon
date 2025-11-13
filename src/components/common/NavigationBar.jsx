import { Link } from 'react-router-dom';
import useAuth from "../../firebaseServices/auth/useAuth";

function NavigationBar() {
  const { user } = useAuth();

  return (
    <nav style={{ 
      height: '5vh', 
      boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)'
    }}>
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', alignItems: 'center', height: '100%' }}>
        <h1>VOLTIZEN</h1>
        {user && (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/inventory">Inventory</Link>
            </li>
            <li>
              <Link to="/mappage">Map</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            
            <li>
              <Link to="/connections">Connections</Link>
            </li>
          </>
        )}

        {!user && (
          <li>
            <Link to="/login">Log In</Link>
          </li>
        )}
        <li>
          <Link to="/testpage">Testing Page</Link>
        </li>

      </ul>
    </nav>
  )
}

export default NavigationBar;