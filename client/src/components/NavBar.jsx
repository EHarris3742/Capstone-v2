import { Link } from "react-router-dom";
import "../styles/NavBar.css";

const NavBar = () => {

    console.log("NavBar loaded") 

  return (


    
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">The Closet</Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/account">Account</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </div>
    </nav>
  );
}


export default NavBar;
