import React, { useState } from 'react'
import "./Login.css"
import { Link } from 'react-router-dom'
import { loginUser } from '../../service/authService'

const Login = () => {

 const [data,setData] = useState({
         email: "",
         password: ""
     })

  const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setData(data => ({...data, [name]: value}));
    }

    const onSubmitHandler = async(event) => {
         event.preventDefault();
        //  try{
        //      const response = await loginUser(data);
        //      if(response.status==201){
        //          toast.success("lo is completed. Please login");
        //          navigate("/login");
 
        //      }
        //      else{
        //          toast.error("Unable to register. Please try again");
 
        //      }
        //  }
        //  catch(err){
        //      toast.error("Unable to register. Please try again");
        //  }
     }
    

  return (
    <div className="login-container">
        <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
                <h5 className="card-title text-center mb-5 fw-light fs-5">Sign In</h5>
                <form>
                <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" name='email' onChange={onChangeHandler} value={data.email}/>
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password" name='password' onChangeHandler={onChangeHandler} value={data.password}/>
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="d-grid">
                    <button className="btn btn-outline-primary btn-login text-uppercase" type="submit">Sign
                    in</button>
                    <button className="btn btn-outline-danger btn-login text-uppercase mt-2" type="submit">Reset 
                    </button>
                </div>
                {/* <hr className="my-4" />
                <div className="d-grid mb-2">
                    <button className="btn btn-google btn-login text-uppercase fw-bold" type="submit">
                    <i className="fab fa-google me-2"></i> Sign in with Google
                    </button>
                </div>
                <div className="d-grid">
                    <button className="btn btn-facebook btn-login text-uppercase fw-bold" type="submit">
                    <i className="fab fa-facebook-f me-2"></i> Sign in with Facebook
                    </button>
                </div> */}
                <div className="mt-4">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </div>
                </form>
            </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Login
