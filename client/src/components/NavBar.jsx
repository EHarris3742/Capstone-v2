import { Link, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Arcade Archive</Link>
      <ul className="nav-links">
        <li><Link to="/" className="nav-button blue">Home</Link></li>
        {token && (
          <li><Link to="/account" className="nav-button blue">Account</Link></li>
        )}
        {!token ? (
          <>
            <li><Link to="/login" className="nav-button green">Login</Link></li>
            <li><Link to="/register" className="nav-button green">Register</Link></li>
          </>
        ) : (
          <li><button onClick={handleLogout} className="nav-button red">Logout</button></li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
