import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Categories from "../components/Categories/Categories";
import FeaturedRestaurants from "../components/FeaturedRestaurants/FeaturedRestaurants";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedRestaurants />
    </>
  );
}

export default Home;