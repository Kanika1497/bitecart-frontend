import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../context/storeContext";
import axios from "axios";
import { assets } from "../../assets/assets";
function MyOrders() {
  const { token } = useContext(StoreContext);
  const [data, setData] = React.useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };


  useEffect(() => {
    console.log("Fetching orders...",token);
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="container">
      <div className="py-5 row justify-content-center">
        <div className="col-11 card">
          <table className="table table-responsive">
            <tbody>
              {data.map((order,index) => (
                <tr key={index}>
                    <td>
                        <img src={assets.logo} alt="" style={{ width: "48px", height: "48px" }} />
                    </td>
                  <td>{order.orderedItems.map((item,index)=>{
                    if(index==order.orderedItems.length-1){
                      return item.name + "X" + item.quantity;
                    }
                    else{
                        return item.name + "X" + item.quantity + ", ";
                    }
                  })}</td>
                  <td>&#x20B9;{((order.amount)/100).toFixed(2)}</td>
                  <td>{order.orderedItems.length}</td>
                  <td className="fw-bold text-capitalize">&#x25cf;{order.orderStatus}</td>
                  <td><button className="btn btn-sm btn-warning" onClick={fetchOrders}>
                    <i className="bi bi-arrow-clockwise"></i></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
