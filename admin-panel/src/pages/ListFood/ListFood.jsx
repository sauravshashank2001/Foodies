import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import "./ListFood.css";
import { deleteFood, getFoodList } from '../../services/foodService';


// function to list food items
const ListFood = () => {
  const [list,setList] = useState([]);
  const fetchList= async () => {
    try {
      const data = await getFoodList();
      setList(data);
    }
    catch (error) {
      toast.error("Error while fetching the food list");
    }
  }

  useEffect(() => {
    fetchList();
  }, []);


  //function to delete food item
  const removeFood = async (foodId) => {
    try {
      const success = await deleteFood(foodId);
      if (success) {
        toast.success("Food item removed successfully");
        await fetchList();
      } else {
        toast.error("Failed to remove the food item");
      }
    } catch (error) {
      toast.error("Error while removing the food item");
    }
  }

  return (
    <div>
      <div className="py-5 row justify-content-center">
        <div className="col-11 card">
          <table>
            <thead>
              <tr className='pt-2 pb-2'>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item,index) => (
                <tr key={item.id} style={{ borderTop: "1px solid #000" }}>
                  <td><img src={item.imageUrl} alt={item.name} height={48} width={48} /></td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>&#8377;{item.price}.00</td>
                  <td className='text-danger'>
                    <i className='bi bi-x-circle-fill' onClick={()=> removeFood(item.id)}></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ListFood;
