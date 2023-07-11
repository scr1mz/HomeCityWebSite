import axios from 'axios';
import type { Listing, ObjectImage, ListingsFilter, User, UsersFilter, Payment, Purchase, Location } from '../../utils/types/listingTypes';

axios.defaults.withCredentials = true;

export const ROOT_URL = `${document.location.protocol}//${document.location.hostname}:8080`;
export const API_URL = `${ROOT_URL}/api`;

//Функции для обработки информации об объектах

export const getListings = async (id: number, limit: number, filter: ListingsFilter): Promise<Listing[]> => {
    try {
        const response = await axios.get(
            `${API_URL}/objects`,
            {
                params: {
                    id,
                    limit,
                    filter
                }
            }
        );

        const listings = response.data;

        // Обработка URL-адреса изображений
        return listings.map((listing: Listing) => ({
            ...listing,
            images: listing.images.map((img: ObjectImage) => ({
                ...img,
                image_url: `${ROOT_URL}/${img.image_url}`
            }))
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
};


export const getListingById = async (id: string): Promise<Listing> => {
    const response = await axios.get(`${API_URL}/object/${id}`);
    const listing = response.data;

    // Обработка URL-адреса изображений
    return {
        ...listing,
        images: listing.images.map((img: ObjectImage) => ({
            ...img,
            image_url: `${ROOT_URL}/${img.image_url}`
        }))
    };
};

export const getObjectImages = async (objectId: number): Promise<ObjectImage[]> => {
    try {
        const response = await axios.get(`${API_URL}/object/${objectId}/images`);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getObjectOwnership = async (objectId: number): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/object/${objectId}/ownership`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const addObjectAgent = async (objectId: number, agentId: number): Promise<any> => {
    try {
        const response = await axios.put(`${API_URL}/object/${objectId}/agent`, {
            agent_id: agentId
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};


//Функции для обработки пользователей
export const getUserById = async (id:string) => {
    try {
        const response = await axios.get(`${API_URL}/user/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const getLatestListings = async (count: number): Promise<Listing[]> => {
    try {
        const response = await axios.get(`${API_URL}/listings/latest?count=${count}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getLocations = async (name: string): Promise<Location[]> => {
    try {
        const response = await axios.post(
            `${API_URL}/utils/getLocations`,
            { name }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getAddrs = async (name: string, city: string): Promise<Location[]> => {
    try {
        const response = await axios.post(
            `${API_URL}/utils/getAddrs`,
            { name, city }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const createUser = async (fullName: string, phone: string, email: string, password: string): Promise<any | null> => {
    try {
        const response = await axios.post(
            `${API_URL}/user`,
            {full_name: fullName, phone, email, password}
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const setToken = async (email: string, password: string): Promise<any | null> => {
    try {
        const response = await axios.post(
            `${API_URL}/token`,
            { email, password }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const refreshToken = async (): Promise<any | null> => {
    try {
        const response = await axios.put(
            `${API_URL}/token`
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteToken = async (): Promise<Boolean> => {
    try {
        await axios.delete(
            `${API_URL}/token`
        );
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const createObject = async (object: any): Promise<Listing | null> => {
    try {
        const payload = {...object};
        delete payload.images;
        const response = await axios.post(
            `${API_URL}/object`,
            payload
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const uploadImage = async (objectId: number, file: any): Promise<ObjectImage | null> => {
    try {
        const formData = new FormData();
        formData.append('image', file);
        const response = await axios.post(
            `${API_URL}/object/${objectId}/image`,
            formData,
            {
                params: {
                    id: objectId
                },
                headers: {
                    'Content-Type': "multipart/form-data"
                }
            }
        );
        return {
            ...response.data.image,
            image_url: `${ROOT_URL}/${response.data.image.image_url}`
        };
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getProfile = async (): Promise<any> => {
    try {
        const response = await axios.get(
            `${API_URL}/profile`
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateProfile = async (object: any): Promise<any | null> => {
    try {
        const response = await axios.put(
            `${API_URL}/profile`,
            object
        );
        return response.data.info;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const refill = async (sum: number): Promise<string | null> => {
    try {
        const response = await axios.post(
            `${API_URL}/utils/refill`,
            {sum}
        );
        return response.data.url;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const sendOneTimePassword = async (email: string): Promise<Boolean> => {
    try {
        await axios.post(
            `${API_URL}/sendOneTimePassword`,
            { email }
        );
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const updateObjectCategory = async (id: number, category: string): Promise<Boolean> => {
    try {
        await axios.put(
            `${API_URL}/object/${id}/category`,
            {category}
        );
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const getUsers = async (id: number, limit: number, filter: UsersFilter): Promise<User[]> => {
    try {
        const response = await axios.get(
            `${API_URL}/user`,
            {
                params: {
                    id,
                    limit,
                    filter
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const updateUserRole = async (id: number, role: string): Promise<Boolean> => {
    try {
        await axios.put(
            `${API_URL}/user/${id}/role`,
            {role}
        );
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const getUserPayments = async (id: number): Promise<Payment[] | null> => {
    try {
        const response = await axios.get(
            `${API_URL}/user/${id}/payments`
        );

        return response.data.map((payment: Payment) => ({...payment, date_time: new Date(payment.date_time)}));
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getUserPurchases = async (id: number): Promise<Purchase[] | null> => {
    try {
        const response = await axios.get(
            `${API_URL}/user/${id}/purchases`
        );

        return response.data.map((purchase: Purchase) => ({...purchase, date_time: new Date(purchase.date_time)}));
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteImage = async (objectId: number, id: number): Promise<Boolean> => {
    try {
        await axios.delete(
            `${API_URL}/object/${objectId}/image/${id}`
        );
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const deleteObject = async (id: number): Promise<Boolean> => {
    try {
        await axios.delete(
            `${API_URL}/object/${id}`
        );
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const updateObject = async (object: any): Promise<Listing | null> => {
    try {
        const payload = {...object};
        delete payload.images;
        const response = await axios.put(
            `${API_URL}/object`,
            payload
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
