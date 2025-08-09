import { Link, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); 
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">The Closet</Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          {token && (
            <li><Link to="/account">Account</Link></li>
          )}
          {!token ? (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          ) : (
            <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
