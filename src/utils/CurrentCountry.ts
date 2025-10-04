import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { getItemAsyncStorage, saveItemAsyncStorage } from "./AsyncStorageService";
import { USER_LOCATION_CACHINNG_KEY } from "../../config";


export default function useCurrentCountry() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getLocation = async () => {
    try {
      const cached = await getItemAsyncStorage(USER_LOCATION_CACHINNG_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setLocation(parsed.location);
        setCountry(parsed.country);
        console.log("Using cached location:", parsed);
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      const geo = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (geo.length > 0) {
        const newCountry = geo[0].country;
        setCountry(newCountry);

        await saveItemAsyncStorage(USER_LOCATION_CACHINNG_KEY, { location: loc, country: newCountry });
        console.log("Updated cached location:", newCountry);
      }
    } catch (error) {
      console.log("Location error:", error);
      setErrorMsg("Could not fetch location");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return { location, country, errorMsg };
}
