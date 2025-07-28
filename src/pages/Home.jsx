import ShoeCard from "../components/ShoeCard";
import "../styles/Home.css";

const Home = ({ shoes, setShoes }) => {
  return (
    <div className="home-page">
      <h1>Explore Our Shoe Collection!</h1>
      <div className="shoe-grid">
        {shoes.map((shoe) => (
          <ShoeCard key={shoe.id} shoe={shoe} />
        ))}
      </div>
    </div>
  );
};

export default Home;
