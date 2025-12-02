import React, { useEffect, useState } from 'react'
import {assets} from '../../assets/assets';
import axios from 'axios';
import { addFood } from '../../services/foodService';
import { toast } from 'react-toastify';

const AddFood = () => {

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "biryani",
    price: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data, [name]: value}));
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if(!image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      await addFood(data, image);
      toast.success("Food added successfully");
      setData({
        name: "",
        description: "",
        category: "biryani",
        price: "",
      });
      setImage(null);
    }
    catch(error){
      console.log("Error while adding food: ", error);
      toast.error("Error while adding food");
    }
    
  } 


  return (
    <div className="mx-2 mt-2">
  <div className="row">
    <div className="card col-md-4">
      <div className="card-body">
        <h2 className="mb-4">Add Food</h2>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              <img src={image? URL.createObjectURL(image) : assets.upload} alt="" width={98} height={98}/>
            </label>
            <input type="file" className="form-control" id="image" hidden onChange={(e)=> setImage(e.target.files[0])} />
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" placeholder='Enter the name' name="name" onChange={onChangeHandler} value={data.name}/>
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea className="form-control" id="description" placeholder='write something here' rows="5" name="description" onChange={onChangeHandler} value={data.description}></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <select className="form-control" id="category" name="category" onChange={onChangeHandler} value={data.category}>
              <option value="biryani">Biryani</option>
              <option value="burger">Burger</option>
              <option value="cake">Cake</option>
              <option value="pizza">Pizza</option>
              <option value="rolls">Rolls</option>
              <option value="salad">Salad</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input type="number" className="form-control" id="price" placeholder='&#8377;200' required name="price" onChange={onChangeHandler} value={data.price}/>
          </div>

         
          <button type="submit" className="btn btn-primary">Save</button>
        </form>
      </div>
    </div>
  </div>
</div>
  )
}

export default AddFood;
