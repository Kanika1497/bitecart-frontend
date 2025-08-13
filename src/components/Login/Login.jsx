import React, { useContext } from "react";
import "./Login.css";
import {Link,useNavigate} from "react-router-dom";
import { login } from "../../service/FoodService";
import { toast } from "react-toastify";
import {StoreContext} from '../../context/storeContext';
function Login() {
  const {setToken,loadCartData}= useContext(StoreContext);
  const navigate = useNavigate();
  const[data,setData] = React.useState({
    email: '',
    password: ''
  })

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  }
  
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", data);
    try {
      const response = await login(data);
      if (response.token) {
        setToken(response.token);
        localStorage.setItem("token", response.token);
        toast.success("Login successful!");
        loadCartData(response.token);
        navigate("/");  
      } else {
        toast.error("Login failed. Please check your credentials.");
    }
    } catch (error) {
      toast.error("An error occurred during login. Please try again.");
      console.log("Error in login", error);
    }
    
  }
  return (
    <div className="container login-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">
                Sign In
              </h5>
              <form onSubmit={onSubmitHandler}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    name = "email"
                    value={data.email}
                    onChange={onChangeHandler}
                    required
                  />
                  <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    name="password"
                    value={data.password}
                    onChange={onChangeHandler}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="d-grid">
                  <button
                    className="btn btn-outline-primary btn-login text-uppercase "
                    type="submit"
                  >
                    Sign in
                  </button>
                   <button
                    className="btn btn-outline-danger btn-login text-uppercase mt-2"
                    type="reset"
                  >
                    Reset
                  </button>
                </div>
                <div className="mt-4">
                    Already Have an account? <Link to="/register">Sign Up</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
