import axios from "axios";


const API_URL = "http://localhost:8080/api/cart";

export const addToCart = async (foodId, token) => {
    try{

        await axios.post(API_URL,{foodId}, {headers: {"Authorization":`Bearer ${token}`}});

        console.log("error while adding cart data",err)

    }
    catch(err){

    }
}


export const removeQtyFromCart = async (foodId, token) => {
    try{

        await axios.post(API_URL+"/remove",{foodId}, {headers: {"Authorization":`Bearer ${token}`}});

        console.log("error while removing cart data",err)

    }
    catch(err){

    }
}

export const getCartData = async(token) => {
    try{

         const response =  await axios.get(API_URL, {"headers": {Authorization: `Bearer ${token}`}});
        return response.data.items;
    }
    catch(err){
        console.log("error while fetching cart data",err)
    }
}