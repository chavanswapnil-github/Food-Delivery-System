import "./RecentOrders.css";

const orders = [
  {
    id: 1024,
    customer: "Rahul Sharma",
    amount: 499,
    status: "Delivered",
  },
  {
    id: 1025,
    customer: "Priya Patel",
    amount: 299,
    status: "Preparing",
  },
  {
    id: 1026,
    customer: "Amit Singh",
    amount: 699,
    status: "Out for Delivery",
  },
];

function RecentOrders() {
  return (
    <div className="orders-card">
      <h2>Recent Orders</h2>

      {orders.map(order => (
        <div
          className="order-row"
          key={order.id}
        >
          <div>
            <h4>#{order.id}</h4>
            <p>{order.customer}</p>
          </div>

          <div>
            <strong>₹{order.amount}</strong>
            <span>{order.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentOrders;