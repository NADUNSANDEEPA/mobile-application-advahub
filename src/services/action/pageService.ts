import { AxiosResponse } from "axios";
import CommonResponse from "../../interface/CommonResponse";
import { PageData } from "../../interface/PageData";
import ApiService from "../ApiService";

export const pageCreate = async (data: PageData): Promise<CommonResponse> => {
    try {
        const response = await ApiService.post<CommonResponse>('/pages/pages/create', data);
        return response.data;
    } catch (err: any) {
        return { success: false, message: 'Network error', error: err.message };
    }
};

export const checkIsPageAvailable = async (ownerId: any): Promise<CommonResponse> => {
    console.log("User Id : " + ownerId);

    try {
        const response = await ApiService.get<CommonResponse>(`/pages/pages/getPageByOwnerId/${ownerId}`);
        return response.data;
    } catch (error: any) {
        console.log("Error checking page availability:", error);
        return {
            success: false,
            message: error?.response?.data?.message || "Failed to check page availability",
            data: null,
        };
    }
};

export const postActivity = async (data: any): Promise<CommonResponse> => {
    try {
        const response = await ApiService.post<CommonResponse>('/pages/activities/publish', data);
        return response.data;
    } catch (error: any) {
        console.error("Error posting activity:", error);
        return {
            success: false,
            message: error?.response?.data?.message || "Failed to post activity",
            data: null,
        };
    }
};

export const retrieveActivityies = async (
    pageId: string,
    page: number = 1,
    limit: number = 2
): Promise<any> => {
    try {
        const response = await ApiService.get<any>(`/pages/activities/retrieve/${pageId}?page=${page}&limit=${limit}`);
        console.log(`Retrieving activities for pageId: ${pageId}, page: ${page}, limit: ${limit}`);
        console.log(response);

        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error?.response?.data?.message || "Failed to retrieve activities",
            data: null,
        };
    }
};


export const activeInactiveActivity = async (
    activityId: string,
    isActive: boolean
): Promise<CommonResponse> => {
    try {
        const response = await ApiService.put<any>(
            `/pages/activities/activityStatusChange/${activityId}`,
            { isActive }
        );

        return {
            success: response.data?.success || false,
            message: response.data?.message || "",
            data: response.data?.data || null,
        };
    } catch (error: any) {
        console.error("Error updating activity status:", error.response || error.message);
        return {
            success: false,
            message: error.response?.data?.message || error.message,
            data: null,
        };
    }
};

export const fetchNearestLocations = async (
    country: string,
    page: number = 1,
    limit: number = 5
): Promise<any> => {
    try {
        const response: AxiosResponse<CommonResponse> = await ApiService.get(
            `/pages/pages/getPagesBasedOnCountry/${country}?page=${page}&limit=${limit}`
        );

        return {
            success: response.data?.success || false,
            message: response.data?.message || "",
            data: response.data?.data || [],
        };
    } catch (error: any) {
        console.error("Error fetching locations:", error.response || error.message);
        return {
            success: false,
            message: error.response?.data?.message || error.message,
            data: [],
        };
    }
};


export const favoritePageStatus = async (
    data: {
        visitorId: string;
        visitorEmail: string;
        pageId: string;
        pageTitle: string;
        isFavorite: boolean;
    }
): Promise<CommonResponse> => {
    try {
        const response: AxiosResponse<CommonResponse> = await ApiService.post(
            `/pages/pages/pageMakeAsFavorite`,
            data
        );
        return response.data;
    } catch (error: any) {
        console.error("Error saving favorite page status:", error);
        throw error.response?.data || error;
    }
};