import axios, { AxiosInstance, AxiosResponse } from "axios";
import { BASE_URL } from "../../config";


class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
    });

    // Log requests
    this.axiosInstance.interceptors.request.use((config) => {
      console.log("➡️ Axios Request:", config.method?.toUpperCase(), config.url, config.data);
      return config;
    });

    // Log responses
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log("✅ Axios Response:", response.status, response.data);
        return response;
      },
      (error) => {
        console.log("❌ Axios Error:", error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  public async post<T>(url: string, data: object): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data);
  }

  public async get<T>(url: string, params?: object): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, { params });
  }

  public async put<T>(url: string, data: object): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data);
  }

  public async delete<T>(url: string, params?: object): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, { params });
  }
}

export default new ApiService(BASE_URL);
