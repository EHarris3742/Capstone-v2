import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  const [shoes, setShoes] = useState([]);

  useEffect(() => {
    setShoes([
      {
        id: 1,
        name: "Air Jordan 1",
        brand: "Nike",
        price: 200,
        image_url:
          "https://m.media-amazon.com/images/I/71HWbK3LX6L._UY900_.jpg",
      },
      {
        id: 2,
        name: "Yeezy Boost 350",
        brand: "Adidas",
        price: 220,
        image_url:
          "https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Beluga-Reflective-Product.jpg",
      },
    ]);
  }, []);

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home shoes={shoes} setShoes={setShoes} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </div>
  );
}

export default App;
