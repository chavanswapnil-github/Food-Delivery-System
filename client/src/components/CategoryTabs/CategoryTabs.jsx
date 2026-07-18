import "./CategoryTabs.css";

const categories = [
  "All",
  "Pizza",
  "Burger",
  "Chinese",
  "Biryani",
  "Drinks",
  "Dessert"
];

function CategoryTabs({ active, setActive }) {

  return (

    <div className="category-tabs">

      {categories.map(category => (

        <button
          key={category}
          className={
            active === category
              ? "tab active"
              : "tab"
          }
          onClick={() => setActive(category)}
        >
          {category}
        </button>

      ))}

    </div>

  );

}

export default CategoryTabs;