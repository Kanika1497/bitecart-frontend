import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/storeContext";
import { calculateCartTotals } from "../../util/cartUtils";
import { useState } from "react";
import { toast } from "react-toastify";
import { RAZORPAY_KEY } from "../../util/constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PlaceOrder() {
  const { foodList, quantities, setQuantities, token } =
    useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const cartItems = foodList.filter((food) => quantities[food.id] > 0);
  const { subTotal, shipping, tax, total } = calculateCartTotals(
    cartItems,
    quantities
  );

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };
  const intiateRazorpayPayment = (order) => {
    console.log(order.amount)
    const options = {
      key: RAZORPAY_KEY, // Replace with your Razorpay key
      amount: order.amount , // Amount in paise
      currency: "INR",
      name: "BiteCart",
      description: "Order Payment",
      order_id: order.razorPayOrderId,
      handler: async function (razorpayResponse) {
        console.log(razorpayResponse);
        await verifyPayment(razorpayResponse);
      },
      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phoneNumber,
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: async function () {
          await deleteOrder(order._id);
          toast.error("Payment cancelled. Order not placed.");
        },
      },
    };
    console.log(options);
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const verifyPayment = async (razorpayResponse) => {
    const paymentData = {
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
    };

    try {
      console.log(paymentData);
      const response = await  axios.post(
        "http://localhost:8080/api/orders/verify",
        paymentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Payment successful! Order placed.");
        await clearCart();
        navigate("/");
      } else {
        toast.error("Payment verification failed. Please try again.");
        navigate("/");
      }
    } catch (error) {
      toast.error("Error verifying payment. Please try again.");
    }
  };
  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:8080/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuantities({});
      toast.success("Cart cleared successfully.");
    } catch (error) {
      toast.error("Error clearing cart. Please try again.");
    }
  };
  const deleteOrder = async (orderId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 204) {
        toast.success("Order deleted successfully");
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      toast.error("Error deleting order. Please try again.");
    }
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const orderData = {
      userAddress: `${data.firstName} ${data.lastName},${data.address}, ${data.city}, ${data.state}, ${data.zip}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      orderedItems: cartItems.map((item) => ({
        foodId: item.id,
        quantity: quantities[item.id],
        name: item.name,
        price: item.price * quantities[item.id],
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
      })),
      amount: (total).toFixed(2)*100,
      orderStatus: "Preparing",
    };
    console.log(orderData);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/orders/create",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response);
      if (response.status === 201 && response.data.razorPayOrderId) {
        intiateRazorpayPayment(response.data);
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Error placing the order. Please try again.");
    }
  };

  return (
    <div className="container mt-2 mb-4">
      <main>
        <div className="py-5 text-center">
          <img
            className="d-block mx-auto "
            src={assets.logo}
            alt=""
            width="80"
            height="80"
          />
        </div>
        <div className="row g-5">
          <div className="col-md-5 col-lg-4 order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Your cart</span>
              <span className="badge bg-primary rounded-pill">
                {cartItems.length}
              </span>
            </h4>
            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">{item.name}</h6>
                    <small className="text-body-secondary">
                      Qty: {quantities[item.id]}
                    </small>
                  </div>
                  <span className="text-body-secondary">
                    &#8377;{(item.price * quantities[item.id]).toFixed(2)}
                  </span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <div>
                  <span>Shipping :</span>
                </div>
                <span className="text-body-secondary">
                  &#8377;{subTotal === 0 ? 0.0 : shipping.toFixed(2)}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <span>Tax :</span>
                </div>
                <span className="text-body-secondary">{tax.toFixed(2)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (INR)</span>{" "}
                <strong>&#8377;{total.toFixed(2)}</strong>
              </li>
            </ul>
            <form className="card p-2">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Promo code"
                />
                <button type="submit" className="btn btn-secondary">
                  Redeem
                </button>
              </div>
            </form>
          </div>
          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Billing address</h4>
            <form className="needs-validation" onSubmit={onSubmitHandler}>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="firstName" className="form-label">
                    First name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    placeholder="John"
                    value={data.firstName}
                    name="firstName"
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="lastName" className="form-label">
                    Last name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    placeholder="Doe"
                    value={data.lastName}
                    onChange={onChangeHandler}
                    name="lastName"
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div className="input-group has-validation">
                    <span className="input-group-text">@</span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      value={data.email}
                      name="email"
                      onChange={onChangeHandler}
                      required
                    />
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="phone"
                    placeholder="9045873925"
                    name="phoneNumber"
                    value={data.phoneNumber}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    placeholder="1234 Main St"
                    name="address"
                    value={data.address}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                <div className="col-md-5">
                  <label htmlFor="country" className="form-label">
                    State
                  </label>
                  <select
                    className="form-select"
                    id="state"
                    required
                    name="state"
                    value={data.state}
                    onChange={onChangeHandler}
                  >
                    <option value="">Choose...</option>
                    <option>Karnataka</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <select
                    className="form-select"
                    id="city"
                    required
                    name="city"
                    value={data.city}
                    onChange={onChangeHandler}
                  >
                    <option value="">Choose...</option>
                    <option>Bangalore</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label htmlFor="zip" className="form-label">
                    Zip
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="zip"
                    placeholder=""
                    value={data.zip}
                    name="zip"
                    onChange={onChangeHandler}
                    required
                  />
                </div>
              </div>
              <hr className="my-4" />
              <button
                className="w-100 btn btn-primary btn-lg"
                type="submit"
                disabled={cartItems.length === 0}
              >
                Continue to checkout
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PlaceOrder;
