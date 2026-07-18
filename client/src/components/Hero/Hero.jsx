import "./Hero.css";
import heroImage from "../../assets/hero.png"; // Fixed asset import path

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        <span className="hero-tag">
          🚀 Fast & Fresh Delivery
        </span>

        <h1>
          Delicious Food
          <br />
          Delivered To
          <span> Your Door</span>
        </h1>

        <p>
          Discover the best restaurants, amazing offers,
          and enjoy fast delivery from your favorite places.
        </p>

        <div className="hero-buttons">
          <button className="order-btn">
            Order Now
          </button>

          <button className="menu-btn">
            Explore Menu
          </button>
        </div>

        <div className="hero-stats">

          <div>
            <h2>500+</h2>
            <p>Restaurants</p>
          </div>

          <div>
            <h2>50K+</h2>
            <p>Customers</p>
          </div>

          <div>
            <h2>4.9 ★</h2>
            <p>Ratings</p>
          </div>

        </div>

      </div>

      <div className="hero-image">

        <img
          src={heroImage}
          alt="Food"
        />

      </div>

    </section>
  );
}

export default Hero;