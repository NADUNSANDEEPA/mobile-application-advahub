import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { jwtDecode } from "jwt-decode";

import TopBar from "../components/AppBar/TopBar";
import BottomBar from "../components/AppBar/BottomBar";
import Home from "./customer/Home";
import IntroBussinessPage from "./client/BussinessPage/IntroBussinessPage";
import CreateBussinessPage from "./client/BussinessPage/CreateBussinessPage";
import SearchScreen from "./customer/Search";
import BussinessPage from "./client/BussinessPage/BussinessPageView";
import AddActivityScreen from "./client/BussinessPage/components/AddActivityScreen";
import CustomerViewPlaces from "./customer/sections/CustomerViewPlaces";

import { checkIsPageAvailable } from "../services/action/pageService";
import { BussinessPageProps } from "../interface/BussinessPageProps";
import NotificationScreen from "./customer/NotificationScreen";
import { getItemAsyncStorage, removeItemAsyncStorage, saveItemAsyncStorage } from "../utils/AsyncStorageService";
import { PAGE_DETAILS_CACHINNG_KEY, USER_TOKEN_CACHINNG_KEY } from "../../config";

export default function HomeScreen() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>("Home");
  const [selectedPage, setSelectedPage] = useState<BussinessPageProps | null>(null);
  const [pageData, setPageData] = useState<BussinessPageProps | null>(null);
  const [loadingPage, setLoadingPage] = useState(false);

  const loadPageData = useCallback(async () => {
    setLoadingPage(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const cachedPage = await getItemAsyncStorage(PAGE_DETAILS_CACHINNG_KEY);
      if (cachedPage) {
        setPageData(JSON.parse(cachedPage));
        return;
      }

      const token = await getItemAsyncStorage(USER_TOKEN_CACHINNG_KEY);
      if (!token) return;

      const decodedToken: any = jwtDecode(token);
      const response = await checkIsPageAvailable(decodedToken.user._id);

      if (response.success && response.data) {
        setPageData(response.data);
        await saveItemAsyncStorage(PAGE_DETAILS_CACHINNG_KEY, response.data);
      } else {
        setPageData(null);
        await removeItemAsyncStorage(PAGE_DETAILS_CACHINNG_KEY);
      }
    } catch (error) {
      console.log("Error loading page:", error);
      setPageData(null);
    } finally {
      setLoadingPage(false);
    }
  }, []);

  useEffect(() => {
    if (activeScreen === "Page") loadPageData();
  }, [activeScreen, loadPageData]);

  const handleViewPlace = (placeData: BussinessPageProps) => {
    setSelectedPage(placeData);
    setActiveScreen("ViewPlace");
  };

  const renderContent = () => {
    switch (activeScreen) {
      case "Home":
        return <Home viewPlace={handleViewPlace} />;

      case "ViewPlace":
        return selectedPage ? (
          <CustomerViewPlaces selectedPage={selectedPage} />
        ) : (
          <Loader />
        );

      case "Notifications":
        return <NotificationScreen />;

      case "Search":
        return <SearchScreen />;

      case "Page":
        if (loadingPage) return <Loader />;
        return pageData ? (
          <BussinessPage
            data={pageData}
            isAddButtonCall={() => setActiveScreen("AddActivity")}
          />
        ) : (
          <IntroBussinessPage
            onGetStarted={() => setActiveScreen("CreateBusiness")}
          />
        );

      case "AddActivity":
        return (
          <AddActivityScreen
            pageData={pageData}
            onSave={() => setActiveScreen("Page")}
            onClose={() => setActiveScreen("Page")}
          />
        );

      case "CreateBusiness":
        return <CreateBussinessPage backToPage={() => setActiveScreen("Page")} />;

      default:
        return <Home viewPlace={handleViewPlace} />;
    }
  };

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require("../../assets/home-wallpaper.webp")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.container}>
          {/* Top Bar */}
          <TopBar
            title="AdvaHub"
            onNotificationPress={() => setActiveScreen("Notifications")}
            onPageIconPress={() => setActiveScreen("Page")}
          />

          {/* Content */}
          <View style={styles.contentContainer}>{renderContent()}</View>

          {/* Bottom Bar */}
          <BottomBar
            activeTab={activeScreen}
            setActiveTab={(tab: string) => setActiveScreen(tab as ScreenType)}
          />
        </View>
      </ImageBackground>
    </SafeAreaProvider>
  );
}

const Loader = () => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color="#007bff" />
  </View>
);

type ScreenType =
  | "Home"
  | "ViewPlace"
  | "Notifications"
  | "Search"
  | "Page"
  | "AddActivity"
  | "CreateBusiness";

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 80,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
