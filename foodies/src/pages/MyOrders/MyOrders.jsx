import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets';
import axios from 'axios';
import "./MyOrder.css"
const MyOrders = () => {

    const {token} = useContext(StoreContext);
    const [data,setData] = useState([]);

    const fetchOrders = async() => {
        const response = await axios.get("http://localhost:8080/api/orders",{
            headers: {
                "Authorization":    `Bearer ${token}`
            },
        });

        setData(response.data);
    };

    useEffect(()=>{
        if(token){
            fetchOrders();
        }
    },[token])


  return (
    <div className='container'>
      <div className="py-5 row justify-content-center">
        <div className="col-11 card">
            <table className="table table-responsive">
                <tbody>
                    {Array.isArray(data) &&
                        data.map((order) => (
                        <tr key={order.id}>
                            <td>
                            <img
                                src={assets.logo || assets.placeholder}
                                height={48}
                                width={48}
                                alt=""
                            />
                            </td>

                            <td>
                            {Array.isArray(order.orderedItems)
                                ? order.orderedItems
                                    .map(
                                    (item) => `${item.name} x ${item.quantity}`
                                    )
                                    .join(", ")
                                : "—"}
                            </td>

                            <td>₹{order.amount.toFixed(2) ?? 0}</td>
                            <td>Items: {order.orderedItems?.length ?? 0}</td>
                            <td className="fw-bold text-capitalize">
                            ● {order.orderStatus || "pending"}
                            </td>

                            <td>
                            <button
                                className="btn btn-sm btn-warning"
                                onClick={fetchOrders}
                            >
                                <i className="bi bi-arrow-clockwise"></i>
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>

                {/* <tbody>
                    {
                        data.map((order,index)=>{
                            return (
                                <tr key={index}>
                                    <td>
                                        <img src="" alt="" height={48} width={48}/>
                                    </td>
                                    <td>{order.orderedItems.map((item,index)=>{
                                        if(index === order.orderedItems.length-1){
                                            return item.name + " x " + item.quantity;
                                        }
                                        else{
                                            return item.name + " x "+item.quantity+", "
                                        }
                                    })}</td>
                                    <td>&#x20B9;{order.amount}</td>
                                    <td>Items: {order.orderedItems.length}</td>
                                    <td className='fw-bold text-capitalize'>&#x25cf;{order.orderStatus}</td>
                                    <td>
                                        <button className='btn btn-sm btn-warning' onClick={fetchOrders}>
                                            <i className='bi bi-arrow-clockwise'></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody> */}
            </table>
        </div>
      </div>
    </div>
  )
}

export default MyOrders;
