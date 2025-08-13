import axios from "axios";
const API_URL = "http://localhost:8080/api";


export const register= async (data)=>{
    try {
        const response = await axios.post(API_URL+"/register", data);
        return response;
    } catch (error) {
        console.log("Error in registration",error);
        throw error;
    }
}
export const login = async (data) => {
    try {
        const response = await axios.post(API_URL + "/login", data);
        return response;
    } catch (error) {
        console.log("Error in login", error);
        throw error;
    }
}