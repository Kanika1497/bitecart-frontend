import axios from 'axios';
const API_URL="http://localhost:8080/api/foods";

export const fetchFoodList =async()=>{
    try {
       const response= await axios.get(API_URL);
       return response.data;
    } catch (error) {
        console.log('Error fetching the food list',error);
        throw error
    }
}
export const fetchFoodDetails = async (id)=>{
    try {
        const response =await axios.get(API_URL+"/"+id);
        return response.data;
    } catch (error) {
        console.log("Error in fetching Food Details",error);
        throw error
    }
}

export const login = async (data) => {
    try {
        const response = await axios.post("http://localhost:8080/api/login", data);
        return response.data;
    } catch (error) {
        console.log("Error in login", error);
        throw error;
    }
}