import "./Categories.css";

import burger from "../../assets/images/categories/burger.jpg";
import pizza from "../../assets/images/categories/pizza.jpg";
import biryani from "../../assets/images/categories/biryani.jpg";
import dessert from "../../assets/images/categories/dessert.jpg";
import drinks from "../../assets/images/categories/drinks.jpg";
import healthy from "../../assets/images/categories/healthy.jpg";

const categories = [
  { name: "Burger", image: burger, count: "120+ Restaurants" },
  { name: "Pizza", image: pizza, count: "90+ Restaurants" },
  { name: "Biryani", image: biryani, count: "150+ Restaurants" },
  { name: "Dessert", image: dessert, count: "80+ Restaurants" },
  { name: "Drinks", image: drinks, count: "60+ Restaurants" },
  { name: "Healthy", image: healthy, count: "110+ Restaurants" },
];

function Categories() {
  return (
    <section className="categories">
      {/* Updated: Added premium categories header layout wrapper */}
      <div className="categories-header">
        <h2>Popular Categories</h2>
        <p>
          Explore your favorite cuisines and discover delicious meals.
        </p>
      </div>

      <div className="category-container">
        {categories.map((item, index) => (
          /* Updated: Refactored category cards layout structure */
          <div className="category-card" key={index}>
            <div className="category-image">
              <img src={item.image} alt={item.name} />
            </div>
            <h3>{item.name}</h3>
            <span>{item.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;