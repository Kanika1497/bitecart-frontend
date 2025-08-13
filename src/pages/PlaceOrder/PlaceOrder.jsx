import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/storeContext";
import { calculateCartTotals } from "../../util/cartUtils";

function PlaceOrder() {
  const { foodList, quantities, setQuantities } = useContext(StoreContext);

  const cartItems = foodList.filter((food) => quantities[food.id] > 0);
  const {subTotal ,shipping,tax,total}=calculateCartTotals(cartItems, quantities);
  return (
    <div className="container mt-2 mb-4">
      <main>
        <div class="py-5 text-center">
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
                  <span className="text-body-secondary">&#8377;{(item.price*quantities[item.id]).toFixed(2)}</span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <div>
                  
                  <span >
                    Shipping : 
                  </span>
                </div>
                <span className="text-body-secondary">&#8377;{subTotal===0 ? 0.00 : shipping.toFixed(2)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  
                  <span  >
                    Tax :
                  </span>
                </div>
                <span className="text-body-secondary">{tax.toFixed(2)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (INR)</span> <strong>&#8377;{total.toFixed(2)}</strong>
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
            <form className="needs-validation" novalidate>
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
                    value=""
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
                    value=""
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
                    required
                  />
                </div>
                <div className="col-md-5">
                  <label htmlFor="country" className="form-label">
                    Country
                  </label>
                  <select className="form-select" id="country" required>
                    <option value="">Choose...</option>
                    <option>India</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <select className="form-select" id="state" required>
                    <option value="">Choose...</option>
                    <option>Karnataka</option>
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
                    required
                  />
                </div>
              </div>
              <hr className="my-4" />
              <button className="w-100 btn btn-primary btn-lg" type="submit" disabled={cartItems.length === 0}>
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
