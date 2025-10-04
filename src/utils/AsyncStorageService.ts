import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Save data to AsyncStorage
 */
export const saveItemAsyncStorage = async (key: string, value: any): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.error("Error saving item:", error);
    }
};

/**
 * Get data from AsyncStorage
 */
export const getItemAsyncStorage = async (key: string): Promise<string | null> => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (error) {
        console.error("Error retrieving item:", error);
        return null;
    }
};

/**
 * Remove data from AsyncStorage
 */
export const removeItemAsyncStorage = async (key: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error("Error removing item:", error);
    }
};

/**
 * Clear all AsyncStorage data
 */
export const clearStorageAsyncStorage = async (): Promise<void> => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error("Error clearing storage:", error);
    }
};