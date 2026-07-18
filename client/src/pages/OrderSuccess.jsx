import "./OrderSuccess.css";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

function OrderSuccess() {

    const navigate = useNavigate();

    return (

        <>
            <Navbar />

            <section className="success-page">

                <div className="success-card">

                    <FaCheckCircle className="success-icon"/>

                    <h1>Order Placed Successfully!</h1>

                    <p>
                        Thank you for your order.
                        Your food is now being prepared.
                    </p>

                    <div className="delivery-info">

                        <h3>Estimated Delivery</h3>

                        <span>25 - 30 Minutes</span>

                    </div>

                    <div className="success-buttons">

                        <button
                            onClick={() => navigate("/my-orders")}
                        >
                            Track Order
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() => navigate("/")}
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>

            </section>

        </>

    );

}

export default OrderSuccess;