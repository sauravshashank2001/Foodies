import React, { useContext, useState } from 'react'
import "./PlaceOrder.css"
import {assets} from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { calculateCartTotals } from '../../util/cartUtil';
import { data, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RAZORPAY_KEY } from '../../util/constants';
import axios from 'axios';
import Razorpay from 'razorpay';


const PlaceOrder = () => {

  const {foodList, quantities, setQuantities,token} = useContext(StoreContext);
  
  const navigate = useNavigate();

//   const loadRazorpayScript = () => {
//   return new Promise((resolve) => {
//     if (window.Razorpay) {
//       resolve(true);
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };

  const [data, setData] = useState({
    "firstName": "",
    "lastName": "",
    "email": "",
    "phoneNumber": "",
    "address": "",
    "state": "",
    "city": "",
    "zip":""
  })

  const onChangeHandler = (event) => {

    const name = event.target.name;
    const value = event.target.value;
    setData(data=> ({...data, [name]: value}));


  }

  const onSubmitHandler = async(event) => {
    event.preventDefault();
    const orderData = {
      userAddress: `${data.firstName} ${data.lastName} ${data.address} ${data.city} ${data.state} ${data.zip}`,
      phoneNumber: `${data.phoneNumber}`,
      email : `${data.email}`,
      orderedItem: cartItems.map(item=> ({
        foodId: item.foodId,
        quantity: quantities[item.id],
        price: item.price *quantities[item.id],
        category: item.category,
        imageUrl : item.imageUrl,
        description: item.description,
        name: item.name
      })),
      amount: total.toFixed(2),
      orderStatus: "Preparing"
    };

    try{

      const response = await axios.post("http://localhost:8080/api/orders/create",orderData, {headers: {"Authorization": `Bearer ${token}`}});
      if(response.status ===201 && response.data.razorPayOrderId){
        //initiate the payment
        initiateRazorpayPayment(response.data);
      }
      else{
        toast.error("Unable to place order, please try again");
      }
    }catch(err){
      toast.error("Unable to place order, please try again");

    }

  };

  const initiateRazorpayPayment = (orderResponse) => {
    const options = {
      key: RAZORPAY_KEY,
      amount: orderResponse.amount * 100, //convert to paise
      currency: "INR",
      name: "Food Land",
      description: "Food Order Payment",
      order_id: orderResponse.razorPayOrderId,
      handler: async function(razorpayResponse) {
        await verifyPayment(razorpayResponse);
      },
      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phoneNumber
      },
      theme: {color: "#3399cc"},
      modal: {
        ondismiss: async function(){
          toast.error("Payment cancelled.")
          await deleteOrder(order.id);
        }
      }
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }

  const verifyPayment = async (razorpayResponse) => {
     const paymentData = {
      razorpay_payment_id : razorpayResponse.razorpay_payment_id,
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_signature: razorpayResponse.razorpay_signature
    };
    try{
      const response = await axios.post("http://localhost:8080/api/orders/verify", paymentData, {headers: {"Authorization": `Bearer ${token}`}})
      if(response.status ==200){
        toast.success("Payment successful");
        await clearCart();
        navigate("/myorders");
      }
      else{
          toast.error("Payment failed. Please try again");
          navigate("/");
        }
    }
    catch(err){
      toast.error("Payment failed. Please try again");
      // navigate("/");
    }
  }

  const deleteOrder  =async(orderId)=> {
    try{
     axios.delete("https://localhost:8080/api/orders" + orderId, {headers: {"Authorization":  `Bearer ${token}`}});
     
    }
    catch(err){
      toast.error("Something went wrong. Contact Support team");
    }
  }

  const clearCart = async () => {
    try{
      axios.delete("http://localhost:8080/api/cart",{headers : {"Authorization": `Bearer ${token}`}} );
      setQuantities({});
    }
    catch(err){
      toast.error("error while clearing the cart");
    }
  }

  //cart items
  const cartItems = foodList.filter(food => quantities[food.id] > 0);

  //calculating
  const {subtotal, shipping, tax, total} = calculateCartTotals(cartItems, quantities);
  return (
    <div className='container mt-4'>
        <div className="py-5 text-center">
          <img
            className="d-block mx-auto mb-4"
            src={assets.logo}
            alt=""
            width="98"
            height="98"
          />
        </div>
        <main>
          <div className="row g-5">
          <div className="col-md-5 col-lg-4 order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Your cart</span>
              <span className="badge bg-primary rounded-pill">{cartItems.length}</span>
            </h4>
            <ul className="list-group mb-3">
              {cartItems.map((food) => (
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">{food.name}</h6>
                    <small className="text-body-secondary">Qty: {quantities[food.id]}</small>
                  </div>
                  <span className="text-body-secondary">&#8377;{(food.price * quantities[food.id]).toFixed(2)}</span>
              </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <div>
                  <span className="text-body-secondary">Shipping</span>
                </div>
                <span className="text-body-secondary">&#8377;{shipping.toFixed(2)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div>
                  <span className="text-body-secondary">Tax</span>
                </div>
                <span className="text-body-secondary">&#8377;{tax.toFixed(2)}</span>
              </li>
              
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (INR)</span> <strong>&#8377;{total.toFixed(2)}</strong>
              </li>
            </ul>
          </div>
          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Billing address</h4>
            <form className="needs-validation" onSubmit={onSubmitHandler}>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="firstName" className="form-label">First name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    placeholder=""
                    value={data.firstName}
                    name="firstName"
                    onChange={onChangeHandler}
                    required
                  />
                  <div className="invalid-feedback">
                    Valid first name is required.
                  </div>
                </div>
                <div className="col-sm-6">
                  <label htmlFor="lastName" className="form-label">Last name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    placeholder=""
                    value={data.lastName}
                    onChange={onChangeHandler}
                    name="lastName"
                    required
                  />
                  <div className="invalid-feedback">
                    Valid last name is required.
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="input-group has-validation">
                    <span className="input-group-text">@</span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      name='email'
                      onChange={onChangeHandler}
                      value={data.email}
                      required
                    />
                    
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="number"
                    className="form-control"
                    id="phone"
                    placeholder="+91"
                    value={data.phoneNumber}
                    name='phoneNumber'
                    onChange={onChangeHandler}
                    required
                  />
                  
                </div>
                <div className="col-12">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    placeholder="1234 Main St"
                    value={data.address}
                    name='address'
                    onChange={onChangeHandler}

                    required
                  />
                  
                </div>
                <div className="col-md-5">
                  <label htmlFor="state" className="form-label">State</label>
                  <select className="form-select" id="state" required name='state' value={data.state} onChange={onChangeHandler}>
                    <option >Choose...</option>
                    <option>Karnatka</option>
                  </select>
                  
                </div>
                <div className="col-md-4">
                  <label htmlFor="city" className="form-label">City</label>
                  <select className="form-select" id="city" required name='city' value={data.city} onChange={onChangeHandler}>
                    <option >Choose...</option>
                    <option>Bengaluru</option>
                  </select>
                  
                </div>
                <div className="col-md-3">
                  <label htmlFor="zip" className="form-label">Zip</label>
                  <input
                    type="text"
                    className="form-control"
                    id="zip"
                    placeholder=""
                    required
                    name='zip'
                    value={data.zip}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>
              
              
              
              
              <button className="w-100 btn btn-primary btn-lg my-4" type="submit" disabled={cartItems.length === 0}>
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
