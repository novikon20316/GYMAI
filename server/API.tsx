import axios, { AxiosInstance } from 'axios';

class API {
    private axiosInstance: AxiosInstance;
    private baseURL: string;

    // Constructor to initialize the base URL and axios instance
    constructor() {
        this.baseURL = "http://localhost:5000";
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // Method to fetch data from the backend
    public async fetchData(endpoint: string) {
        try {
            const response = await this.axiosInstance.get(endpoint);
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    // Method to send data to the backend
    public async postData(endpoint: string, data: any) {
        try {
            const response = await this.axiosInstance.post(endpoint, data);
            return response.data;
        } catch (error) {
            console.error('Error posting data:', error);
            throw error;
        }
    }

    public async saveClient(email: string,username:string, password: string,selectedGym:string) {
        try {
            console.log("API in server")
            console.log("email: " + email + ". username: " + username + ". password: " + password + ". gym: " + selectedGym)
            const response = await axios.post('http://localhost:5000/api/save-client',{email,username, password,selectedGym});
            return response.data.success;
        } catch (error) {
            console.error('Error posting data:', error);
            throw error;
        }
    }

    public async UserLogin(email: string, password: string){
        try {
            console.log("someone is trying to get in!")
            const response = await axios.post('http://localhost:5000/api/login',{email, password});
            return response.data.success;
        } catch (error) {
            console.error('Error posting data:', error);
            throw error;
        }
    }



}

// Instantiate API class with the base URL of your backend
const api = new API();

// Export the API instance so you can use it elsewhere
export default api;
