import CommonResponse from "../../interface/CommonResponse";
import ApiService from "../ApiService";

export const login = async (email: string, password: string): Promise<CommonResponse> => {
    try {
        const response = await ApiService.post<CommonResponse>('/users/auth/login', { email, password });
        console.log(response);
        return response.data;
    } catch (err: any) {
        return { success: false, message: 'Network error', error: err.message };
    }
};

export const register = async (
    name: string,
    phone: string,
    address: string,
    bloodGroup: string,
    email: string,
    password: string
): Promise<CommonResponse> => {
    try {
        const response = await ApiService.post<CommonResponse>("/users/auth/register", {
            name,
            phone,
            address,
            bloodGroup,
            email,
            password,
        });

        return response.data;
    } catch (error: any) {
        console.error("Register API Error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Registration failed" };
    }
};