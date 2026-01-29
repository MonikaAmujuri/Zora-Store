import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./OrderDetails.css";

function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const found = orders.find(o => String(o.id) === orderId);
    setOrder(found);
  }, [orderId]);

  if (!order) {
    return <p className="empty-text">Order not found</p>;
  }

  

  return (
    <div className="order-details-page">
  <h2 className="order-title">Order Details</h2>

      <div className="order-card">
        <div className="order-meta">
          <p><strong>Order ID:</strong> #{order.id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Email:</strong> {order.userEmail}</p>
        </div>

        {order.items.map((item) => (
        <div className="order-item" key={item.id}>

          <div className="order-info">
            <h4>{item.name}</h4>

            <div className="order-price">
              <span className="final-price">
                ₹ {item.finalPrice} × {item.qty}
              </span>

              {item.discount > 0 && (
                <span className="original-price">
                  ₹ {item.price}
                </span>
              )}
            </div>

            {item.discount > 0 && (
              <p className="saved-text">
                You saved ₹ {(item.price - item.finalPrice) * item.qty}
              </p>
            )}
          </div>
        </div>
         ))}
        

        <div className="order-total">
          <h3>Total: ₹ {order.total}</h3>
        </div>

        <div className="order-address">
          <h3>Delivery Address</h3>
          <p><strong>{order.address.name}</strong></p>
          <p>{order.address.street}</p>
          <p>{order.address.city} - {order.address.pincode}</p>
          <p>{order.address.phone}</p>
        </div>


      </div>
    </div>
   
  );
}

export default OrderDetails;
